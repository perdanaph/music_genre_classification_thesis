from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import torch
from torchvision.models import resnet50
import torch.nn as nn

app = Flask(__name__)
CORS(app)

model_path = "./model/model_music_genre_classification_resnet50.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = resnet50(pretrained = False, num_classes=4)
model.conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

genre_labels = ["pop", "keroncong", "dangdut", "campursari"]

def extrac_audio_mfcc(file_path, n_mfcc=128):
  y, sr = librosa.load(file_path)
  mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc).T
  mfcc = mfcc[np.newaxis, np.newaxis, :]

  mfcc_tensor = torch.tensor(mfcc)

  return mfcc_tensor

@app.route('/predict', methods=["POST"])
def predict():
  if 'file' not in request.files:
    return jsonify({'error': "File tidak ditemukan"}), 400
  
  file = request.files['file']
  if file.filename == '':
    return jsonify({'error': 'Nama file tidak valid'}), 400
  
  try:
    input_features = extrac_audio_mfcc(file).to(device)
    with torch.no_grad():
      output = model(input_features)
      _, predicted_class = torch.max(output, 1)

      predicted_genre = genre_labels[predicted_class.item()]
      return jsonify({'predicted_genre': predicted_genre}), 200
  except Exception as e:
    return jsonify({'error': str(e)}), 500
  
if __name__ == '__main__':
    app.run(debug=True, port=5000)