// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';
import { UAParser } from 'ua-parser-js';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

// Mock environment and context
const mockEnv = {
  // Add any necessary environment variables here
};

const mockCf: IncomingRequestCfPropertiesBase & { botManagement: any, clientTrustScore: number, hostMetadata: any, tlsClientAuth: any } = {
  country: 'US',
  continent: 'NA',
  region: 'CA',
  regionCode: 'CA',
  city: 'San Francisco',
  latitude: '37.7749',
  longitude: '-122.4194',
  timezone: 'America/Los_Angeles',
  asn: 12345,
  asOrganization: 'Example Org',
  hostname: 'example.com',
  colo: 'SFO',
  edgeRequestKeepAliveStatus: 1,
  httpProtocol: 'HTTP/2',
  requestPriority: 'weight=192;exclusive=0',
  tlsCipher: 'AEAD-AES128-GCM-SHA256',
  tlsVersion: 'TLSv1.3',
  botManagement: {
    score: 30,
    verifiedBot: false,
    corporateProxy: false,
    staticResource: true,
    detectionIds: [12, 155, 788]
  },
  clientTrustScore: 0.8,
  hostMetadata: {
    someMetadataKey: 'someMetadataValue'
  },
  tlsClientAuth: {
    certIssuerDNLegacy: 'CN=Example CA, O=Example Org, C=US',
    certIssuerDN: 'CN=Example CA, O=Example Org, C=US',
    certPresented: '1',
    certSubjectDNLegacy: 'CN=example.com, O=Example Org, C=US',
    certSubjectDN: 'CN=example.com, O=Example Org, C=US',
    certNotBefore: 'Nov 1 00:00:00 2021 GMT',
    certNotAfter: 'Nov 1 23:59:59 2022 GMT',
    certSerial: '1234567890',
    certFingerprintSHA1: 'AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12',
    certVerified: 'SUCCESS'
  }
};

describe('IP Checker Worker', () => {
  it('responds with HTML content for root path', async () => {
    const request = new IncomingRequest('https://example.com', { headers: { 'user-agent': 'Mozilla/5.0' } });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, mockEnv, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8');
    const text = await response.text();
    expect(text).toContain('<html');
  });

  it('responds with plain text for text browsers', async () => {
    const request = new IncomingRequest('https://example.com', { headers: { 'user-agent': 'curl/7.64.1', 'cf-connecting-ip': '192.168.1.1' } });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, mockEnv, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.headers.get('content-type')).toBe('text/plain;charset=UTF-8');
    const text = await response.text();
    expect(text).toMatch(/\d+\.\d+\.\d+\.\d+/); // Simple IP address regex
  });

  it('responds with JSON content for /json path', async () => {
    const request = new IncomingRequest('https://example.com/json', { headers: { 'user-agent': 'Mozilla/5.0', 'cf-connecting-ip': '192.168.1.1' }, cf: mockCf });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, mockEnv, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.headers.get('content-type')).toBe('application/json;charset=UTF-8');
    const json = await response.json();
    expect(json).toHaveProperty('ip');
    expect(json).toHaveProperty('country');
  });

  it('responds with 404 for non-existent path', async () => {
    const request = new IncomingRequest('https://example.com/nonexistent', { headers: { 'user-agent': 'Mozilla/5.0' } });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, mockEnv, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });
});
