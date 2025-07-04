import pandas as pd
import tensorflow as tf
import numpy as np
import os

data = pd.read_csv('data/House_Rent_Dataset.csv')

# Preview data
print(data.head())

# Basic preprocessing (example only — clean this as needed)
# Drop rows with missing values
data = data.dropna()

# Select useful features
features = data[['BHK', 'Size', 'Bathroom']]  # add more if desired
labels = data['Rent']

# Normalize features (important for neural networks)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Train/test split (optional)
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(features_scaled, labels, test_size=0.2)

# Build model with explicit Input layer
inputs = tf.keras.Input(shape=(features.shape[1],))
x = tf.keras.layers.Dense(64, activation='relu')(inputs)
x = tf.keras.layers.Dense(32, activation='relu')(x)
outputs = tf.keras.layers.Dense(1)(x)

model = tf.keras.Model(inputs=inputs, outputs=outputs)


model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X_train, y_train, epochs=100, validation_split=0.1)

# Save model
os.makedirs('rent_model', exist_ok=True)
model.export('rent_model/saved_model')
