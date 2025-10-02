#!/usr/bin/env node

/**
 * Test script for form generation endpoint
 * Run: node test-form-endpoint.js [eventId] [token]
 */

import axios from 'axios';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
const eventId = process.argv[2] || 'test-event-id';
const token = process.argv[3] || '';

async function testFormGeneration() {
  console.log('=== Testing Form Generation Endpoint ===');
  console.log('Base URL:', BASE_URL);
  console.log('Event ID:', eventId);
  console.log('Token provided:', token ? 'Yes' : 'No');
  console.log('');

  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    console.log('   Response:', healthResponse.data);
    console.log('');

    // Test 2: Check authentication (if token provided)
    if (token) {
      console.log('2. Testing authentication...');
      try {
        const authResponse = await axios.get(
          `${BASE_URL}/api/event/${eventId}/check-auth`,
          {
            headers: {
              Cookie: `token=${token}`
            }
          }
        );
        console.log('✅ Authentication successful');
        console.log('   User:', authResponse.data.user);
        console.log('');
      } catch (authError) {
        console.log('❌ Authentication failed');
        console.log('   Status:', authError.response?.status);
        console.log('   Error:', authError.response?.data);
        console.log('');
        return;
      }

      // Test 3: Try form generation
      console.log('3. Testing form generation...');
      try {
        const formResponse = await axios.post(
          `${BASE_URL}/api/event/${eventId}/generate-registration-form`,
          {
            editorEmail: 'test@example.com',
            forceRegenerate: false
          },
          {
            headers: {
              Cookie: `token=${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Form generation successful');
        console.log('   Response:', JSON.stringify(formResponse.data, null, 2));
      } catch (formError) {
        console.log('❌ Form generation failed');
        console.log('   Status:', formError.response?.status);
        console.log('   Error:', JSON.stringify(formError.response?.data, null, 2));
      }
    } else {
      console.log('2. Skipping authentication test (no token provided)');
      console.log('');
      console.log('To test with authentication, run:');
      console.log(`   node test-form-endpoint.js ${eventId} YOUR_JWT_TOKEN`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Server is not running or not accessible');
    }
  }
}

// Run tests
testFormGeneration();
