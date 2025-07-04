import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import * as tf from '@tensorflow/tfjs';

function RentPredictionPage() {
  const [model, setModel] = useState(null);
  const [inputs, setInputs] = useState({
    bhk: '',
    size: '',
    bathroom: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);

  // Means and std devs from your Python scaler
  const FEATURE_MEAN = {
    bhk: 2.5,
    size: 1050.3,
    bathroom: 2.1,
  };

  const FEATURE_STD = {
    bhk: 1.3,
    size: 350.5,
    bathroom: 0.7,
  };

  useEffect(() => {
    async function loadModel() {
      try {
        const loadedModel = await tf.loadGraphModel('/tfjs_model/model.json');
        setModel(loadedModel);
        // Warm up model with dummy input
        loadedModel.predict(tf.tensor2d([[0, 0, 0]]));
        setLoadingModel(false);
      } catch (error) {
        console.error('Error loading TensorFlow.js model:', error);
        setLoadingModel(false);
      }
    }
    loadModel();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow only digits and decimal point for input (optional)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isInputValid = () => {
    const bhk = Number(inputs.bhk);
    const size = Number(inputs.size);
    const bathroom = Number(inputs.bathroom);
    return (
      !isNaN(bhk) && bhk > 0 &&
      !isNaN(size) && size > 0 &&
      !isNaN(bathroom) && bathroom > 0
    );
  };

  const handlePredict = async () => {
    if (!model) return;

    if (!isInputValid()) {
      alert('Please enter positive valid numbers for all inputs');
      return;
    }

    const bhk = Number(inputs.bhk);
    const size = Number(inputs.size);
    const bathroom = Number(inputs.bathroom);

    const normBhk = (bhk - FEATURE_MEAN.bhk) / FEATURE_STD.bhk;
    const normSize = (size - FEATURE_MEAN.size) / FEATURE_STD.size;
    const normBathroom = (bathroom - FEATURE_MEAN.bathroom) / FEATURE_STD.bathroom;

    const inputTensor = tf.tensor2d([[normBhk, normSize, normBathroom]]);

    const output = model.predict(inputTensor);
    // Wait for async data extraction
    const rentTensorData = await output.data();
    let rent = rentTensorData[0];

    // Rough calibration scaling factor to approximate US rents
    const SCALING_FACTOR = 0.33;
    rent = rent * SCALING_FACTOR;

    setPrediction(rent.toFixed(2));
  };

  return (
    <>
      <Navbar variant="jobsearch" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)', // adjust if Navbar height changes
          minHeight: '110vh',
          padding: 20,
          boxSizing: 'border-box',
          backgroundColor: '#f0f2f5',
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: '100%',
            padding: 30,
            textAlign: 'center',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <h2 style={{ marginBottom: 30, color: '#111' }}>Rent Prediction</h2>
          {loadingModel && <p style={{ color: '#555' }}>Loading model, please wait...</p>}

          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 600,
                color: '#333',
                fontSize: 16,
              }}
              htmlFor="bhk"
            >
              Bedrooms (BHK):
            </label>
            <input
              id="bhk"
              type="number"
              name="bhk"
              min="0"
              step="1"
              value={inputs.bhk}
              onChange={handleChange}
              onFocus={() => setFocusedInput('bhk')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 16,
                borderRadius: 6,
                borderWidth: '1.5px',
                borderStyle: 'solid',
                borderColor: focusedInput === 'bhk' ? '#0070f3' : '#ccc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              placeholder="Enter number of bedrooms"
            />
          </div>

          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 600,
                color: '#333',
                fontSize: 16,
              }}
              htmlFor="size"
            >
              Size (sq ft):
            </label>
            <input
              id="size"
              type="number"
              name="size"
              min="0"
              step="any"
              value={inputs.size}
              onChange={handleChange}
              onFocus={() => setFocusedInput('size')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 16,
                borderRadius: 6,
                border: '1.5px solid #ccc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                ...(focusedInput === 'size' ? { borderColor: '#0070f3' } : {}),
              }}
              placeholder="Enter size in square feet"
            />
          </div>

          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 600,
                color: '#333',
                fontSize: 16,
              }}
              htmlFor="bathroom"
            >
              Bathrooms:
            </label>
            <input
              id="bathroom"
              type="number"
              name="bathroom"
              min="0"
              step="1"
              value={inputs.bathroom}
              onChange={handleChange}
              onFocus={() => setFocusedInput('bathroom')}
              onBlur={() => setFocusedInput(null)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 16,
                borderRadius: 6,
                border: '1.5px solid #ccc',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
                ...(focusedInput === 'bathroom' ? { borderColor: '#0070f3' } : {}),
              }}
              placeholder="Enter number of bathrooms"
            />
          </div>

          <button
            onClick={handlePredict}
            disabled={loadingModel || !isInputValid()}
            style={{
              marginTop: 24,
              padding: '12px 24px',
              fontSize: 18,
              fontWeight: '600',
              borderRadius: 8,
              border: 'none',
              backgroundColor: loadingModel || !isInputValid() ? '#999' : '#0070f3',
              color: '#fff',
              cursor: loadingModel || !isInputValid() ? 'not-allowed' : 'pointer',
              boxShadow: '0 3px 8px rgba(0, 112, 243, 0.4)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={(e) => {
              if (!loadingModel && isInputValid()) {
                e.target.style.backgroundColor = '#005bb5';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 91, 181, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingModel && isInputValid()) {
                e.target.style.backgroundColor = '#0070f3';
                e.target.style.boxShadow = '0 3px 8px rgba(0, 112, 243, 0.4)';
              }
            }}
          >
            Predict Rent
          </button>

          {prediction !== null && (
            <div
              style={{
                marginTop: 36,
                fontSize: 24,
                fontWeight: '700',
                color: '#000',
                backgroundColor: '#e0e0e0',
                padding: '14px 0',
                borderRadius: 10,
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
              }}
            >
              Estimated Rent: <span style={{ color: '#000' }}>${prediction}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RentPredictionPage;
