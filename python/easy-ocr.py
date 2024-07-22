import cv2
import easyocr
import json
import sys

img = cv2.imread(sys.argv[1])
output = sys.argv[2]
scale_factor = 4
upscaled = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_LINEAR)
blur = cv2.blur(upscaled, (2, 2))
blur = cv2.cvtColor(upscaled, cv2.COLOR_BGR2GRAY)

if img is None:
    raise ValueError("Error loading the image. Please check the file path.")

def convert_detection(detection):
    # Convert bounding boxes and other data to native Python types
    bounding_box, text, confidence = detection
    bounding_box = [list(map(float, point)) for point in bounding_box]
    return {
        'bounding_box': bounding_box,
        'text': text,
        'confidence': float(confidence)
    }

reader = easyocr.Reader('', gpu=True)
text_detections = reader.readtext(blur, text_threshold=0.3, allowlist='HJBUCOSBBB0123456789.')

serializable_detections = [convert_detection(d) for d in text_detections]

json_data = json.dumps(serializable_detections, ensure_ascii=False)

with open(output, 'w') as file:
    file.write(json_data)


# for detection in text_detections:
#     bounding_box, text, confidence = detection
    
#     # Print the text and its confidence
#     print(f"Detected text: {text}")
#     print(f"Confidence: {confidence:.2f}\n")