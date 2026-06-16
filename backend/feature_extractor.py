import io
import math
import base64
import cv2
import numpy as np
from PIL import Image

def cv2_to_base64(img_cv):
    """Encodes an OpenCV image array to a base64 PNG data URL."""
    _, buffer = cv2.imencode(".png", img_cv)
    img_b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{img_b64}"

def extract_abcd_features(
    img: Image.Image,
    blur_kernel: int = 5,
    clahe_clip: float = 2.0,
    dull_razor_thresh: int = 10
):
    """
    Extracts clinical dermatological features and runs actual OpenCV preprocessing & segmentation.
    Returns:
        dict: Preprocessed images, extracted features, contour coordinates, and status.
    """
    # 1. Convert PIL Image to OpenCV NumPy Array (BGR format)
    # We load image bytes to be safe
    img_cv_orig = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    h_orig, w_orig = img_cv_orig.shape[:2]
    
    # Resize to standard size (300x300) for uniform analysis
    size = 300
    img_cv = cv2.resize(img_cv_orig, (size, size))
    img_cv_resized_copy = img_cv.copy()
    
    # Dull-Razor Hair Removal Filter
    if dull_razor_thresh > 0:
        gray_temp = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        hair_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9))
        blackhat = cv2.morphologyEx(gray_temp, cv2.MORPH_BLACKHAT, hair_kernel)
        _, hair_mask = cv2.threshold(blackhat, int(dull_razor_thresh), 255, cv2.THRESH_BINARY)
        img_cv = cv2.inpaint(img_cv, hair_mask, 1, cv2.INPAINT_TELEA)
    
    # 2. RUN REAL OPENCV PREPROCESSING STAGES
    # A. Denoising (Gaussian Blur)
    k_size = int(blur_kernel)
    if k_size < 1:
        k_size = 1
    elif k_size % 2 == 0:
        k_size += 1
    img_denoised = cv2.GaussianBlur(img_cv, (k_size, k_size), 0)
    
    # Convert to YCrCb or Lab to apply equalization on Lightness channel only (preserves color)
    img_lab = cv2.cvtColor(img_denoised, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(img_lab)
    
    # B. Contrast Enhancement (CLAHE - Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=float(clahe_clip), tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l_channel)
    img_lab_enhanced = cv2.merge((l_enhanced, a_channel, b_channel))
    img_enhanced = cv2.cvtColor(img_lab_enhanced, cv2.COLOR_LAB2BGR)
    
    # C. Global Histogram Equalization
    l_equalized = cv2.equalizeHist(l_channel)
    img_lab_equalized = cv2.merge((l_equalized, a_channel, b_channel))
    img_equalized = cv2.cvtColor(img_lab_equalized, cv2.COLOR_LAB2BGR)
    
    # 3. RUN REAL OPENCV LESION SEGMENTATION
    # Convert enhanced image to grayscale
    gray = cv2.cvtColor(img_enhanced, cv2.COLOR_BGR2GRAY)
    
    # Otsu's thresholding to isolate dark lesion against light skin background
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw contours on a copy of the original image (boundary highlight)
    img_boundaries = img_cv.copy()
    cv2.drawContours(img_boundaries, contours, -1, (0, 255, 0), 2) # Green borders
    
    # Select largest contour representing the core lesion
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        # Calculate centroid moments
        moments = cv2.moments(largest_contour)
        if moments["m00"] != 0:
            centroid_x = int(moments["m10"] / moments["m00"])
            centroid_y = int(moments["m01"] / moments["m00"])
        else:
            centroid_x, centroid_y = size // 2, size // 2
            
        area = cv2.contourArea(largest_contour)
        perimeter = cv2.arcLength(largest_contour, True)
    else:
        # Fallback if no contours found
        centroid_x, centroid_y = size // 2, size // 2
        area = 5000.0
        perimeter = 300.0
        
    # Radius approximation for Grad-CAM
    radius = int((area / math.pi) ** 0.5)
    radius = max(35, min(75, radius))

    # --- FEATURE CALCULATIONS ---
    # Convert mask to 0/1 array for math features
    mask = (thresh > 0).astype(np.uint8)
    pixel_count = np.sum(mask)

    # A. Asymmetry (Fold vertically and horizontally)
    flipped_lr = np.fliplr(mask)
    flipped_ud = np.flipud(mask)
    diff_lr = np.sum(np.abs(mask - flipped_lr))
    diff_ud = np.sum(np.abs(mask - flipped_ud))
    asymmetry = float((diff_lr + diff_ud) / (2 * max(1, pixel_count)))
    asymmetry = min(1.0, max(0.0, asymmetry))

    # B. Border Compactness & Circularity
    # Compactness = Perimeter^2 / (4 * pi * Area)
    # Circularity = 4 * pi * Area / Perimeter^2 (Perfect circle = 1.0)
    if area > 10 and perimeter > 10:
        compactness = float((perimeter ** 2) / (4 * math.pi * area))
        circularity = float((4 * math.pi * area) / (perimeter ** 2))
        compactness = min(5.0, max(1.0, compactness))
        circularity = min(1.0, max(0.1, circularity))
    else:
        compactness = 1.2
        circularity = 0.8

    # C. Color Variance (RGB Channel Standard Deviations)
    lesion_pixels = img_cv[mask > 0]
    if len(lesion_pixels) > 0:
        # standard deviations of R, G, B
        std_b = np.std(lesion_pixels[:, 0])
        std_g = np.std(lesion_pixels[:, 1])
        std_r = np.std(lesion_pixels[:, 2])
        color_variance = float((std_r + std_g + std_b) / 3.0)
        
        avg_r = np.mean(lesion_pixels[:, 2])
        avg_g = np.mean(lesion_pixels[:, 1])
        avg_b = np.mean(lesion_pixels[:, 0])
        red_ratio = float(avg_r / (avg_g + avg_b + 1e-5))
    else:
        color_variance = 10.0
        red_ratio = 0.45
        avg_r, avg_g, avg_b = 120, 100, 90

    # D. Diameter (Assumes 300px = 15mm)
    diameter_mm = float((2 * ((area / math.pi) ** 0.5)) * 0.05)
    diameter_mm = min(15.0, max(0.5, diameter_mm))

    # E. Texture Features (Gray-Level Co-occurrence Matrix GLCM approximations)
    # We implement texture contrast, homogeneity, and entropy estimations on the grayscale lesion
    lesion_gray = gray[mask > 0]
    if len(lesion_gray) > 10:
        # 1. Texture Contrast (Variance of neighbor pixel differences)
        # Shift gray array to approximate difference
        diffs = np.diff(gray, axis=1)
        texture_contrast = float(np.mean(diffs ** 2))
        
        # 2. Texture Homogeneity (Inverted difference weights)
        texture_homogeneity = float(np.mean(1.0 / (1.0 + diffs ** 2)))
        
        # 3. Entropy (Uncertainty index based on histogram probability distribution)
        hist_gray, _ = np.histogram(lesion_gray, bins=16, range=(0, 256), density=True)
        hist_gray = hist_gray[hist_gray > 0]
        texture_entropy = float(-np.sum(hist_gray * np.log2(hist_gray)))
    else:
        texture_contrast = 12.5
        texture_homogeneity = 0.65
        texture_entropy = 3.2

    # F. Histograms (Calculate 16-bin histograms for RGB and HSV channels)
    # RGB Histogram arrays
    hist_r = cv2.calcHist([img_cv], [2], mask, [16], [0, 256]).flatten().tolist()
    hist_g = cv2.calcHist([img_cv], [1], mask, [16], [0, 256]).flatten().tolist()
    hist_b = cv2.calcHist([img_cv], [0], mask, [16], [0, 256]).flatten().tolist()
    
    # HSV Histogram arrays
    img_hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)
    hist_h = cv2.calcHist([img_hsv], [0], mask, [16], [0, 180]).flatten().tolist()
    hist_s = cv2.calcHist([img_hsv], [1], mask, [16], [0, 256]).flatten().tolist()
    hist_v = cv2.calcHist([img_hsv], [2], mask, [16], [0, 256]).flatten().tolist()

    # Calculate affected area percentage relative to the total skin frame
    affected_percentage = float((pixel_count / (size * size)) * 100)
    affected_percentage = round(min(95.0, max(2.5, affected_percentage)), 1)

    return {
        # Raw features for model prediction
        "features": [asymmetry, compactness, color_variance, diameter_mm, red_ratio],
        
        # Centroids and sizes
        "centroid": (centroid_x, centroid_y),
        "radius": radius,
        "affected_area": affected_percentage,
        
        # Preprocessed Base64 Images
        "images": {
            "original": cv2_to_base64(img_cv_resized_copy),
            "dull_razor": cv2_to_base64(img_cv),
            "denoised": cv2_to_base64(img_denoised),
            "enhanced": cv2_to_base64(img_enhanced),
            "equalized": cv2_to_base64(img_equalized),
            "segmented": cv2_to_base64(thresh),
            "boundaries": cv2_to_base64(img_boundaries)
        },
        
        # Clinical texture and shape details
        "metrics": {
            "asymmetry": round(asymmetry, 3),
            "compactness": round(compactness, 3),
            "circularity": round(circularity, 3),
            "color_variance": round(color_variance, 2),
            "diameter_mm": round(diameter_mm, 2),
            "texture": {
                "contrast": round(texture_contrast, 2),
                "homogeneity": round(texture_homogeneity, 3),
                "entropy": round(texture_entropy, 3)
            },
            "histograms": {
                "rgb": {"r": hist_r, "g": hist_g, "b": hist_b},
                "hsv": {"h": hist_h, "s": hist_s, "v": hist_v}
            }
        },
        "success": True
    }
