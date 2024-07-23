import easyocr
import json
import sys

img = sys.argv[1]
if img is None:
    raise ValueError("Error loading the image. Please check the file path.")
lang_list = sys.argv[2]
output = sys.argv[3]
ocr_options = sys.argv[4]
readtext_options = sys.argv[5]

# Parse options from JSON strings, default to empty dict if None
ocr_options = json.loads(ocr_options) if ocr_options != 'null' else {}
readtext_options = json.loads(readtext_options) if readtext_options != 'null' else {}

def convert_detection(detection):
    # Convert bounding boxes and other data to native Python types
    bounding_box, text, confidence = detection
    bounding_box = [list(map(float, point)) for point in bounding_box]
    return {
        'bounding_box': bounding_box,
        'text': text,
        'confidence': float(confidence)
    }

reader = easyocr.Reader(lang_list=lang_list, **ocr_options)
text_detections = reader.readtext(img, **readtext_options)

serializable_detections = [convert_detection(d) for d in text_detections]

json_data = json.dumps(serializable_detections, ensure_ascii=False)

with open(output, 'w') as file:
    file.write(json_data)


# for detection in text_detections:
#     bounding_box, text, confidence = detection
    
#     # Print the text and its confidence
#     print(f"Detected text: {text}")
#     print(f"Confidence: {confidence:.2f}\n")