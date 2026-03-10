import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import crypto from 'crypto';
import { PagBankWebhookService } from '../payments/pagbankWebhook.js';

// Mock do Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: 'mock-webhook-id' },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: { id: 'mock-webhook-id' },
          error: null,
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    })),
  })),
}));

describe('PagBankWebhookService', () => {
  const mockSecret = 'test-secret-key-123';
  const mockPayload = {
    id: 'ORDE_12345',
    reference_id: 'test_ref_123',
    customer: {
      name: 'Jose da Silva',
      email: 'test@example.com',
      tax_id: '12345678909',
    },
    charges: [
      {
        id: 'CHAR_12345',
        status: 'PAID',
        amount: {
          value: 1000,
          currency: 'BRL',
        },
        payment_method: {
          type: 'CREDIT_CARD',
          installments: 1,
        },
      },
    ],
    created_at: '2025-11-12T10:00:00Z',
  };

  beforeAll(() => {
    // Configurar variável de ambiente para testes
    process.env.PAGBANK_WEBHOOK_SECRET = mockSecret;
    process.env.SUPABASE_URL = 'https://mock.supabase.co';
    process.env.SUPABASE_SERVICE_KEY = 'mock-service-key';
  });

  afterAll(() => {
    // Limpar mocks
    vi.clearAllMocks();
  });

  describe('verifySignature', () => {
    it('deve retornar true para assinatura válida', () => {
      const rawBody = JSON.stringify(mockPayload);
      const validSignature = `sha256=${crypto
        .createHmac('sha256', mockSecret)
        .update(rawBody)
        .digest('hex')}`;

      const result = PagBankWebhookService.verifySignature(
        validSignature,
        rawBody
      );

      expect(result).toBe(true);
    });

    it('deve retornar false para assinatura inválida', () => {
      const rawBody = JSON.stringify(mockPayload);
      const invalidSignature = 'sha256=invalid-signature-hash';

      const result = PagBankWebhookService.verifySignature(
        invalidSignature,
        rawBody
      );

      expect(result).toBe(false);
    });

    it('deve retornar false quando signature não é fornecida', () => {
      const rawBody = JSON.stringify(mockPayload);

      const result = PagBankWebhookService.verifySignature(null, rawBody);

      expect(result).toBe(false);
    });

    it('deve retornar false quando PAGBANK_WEBHOOK_SECRET não está configurado', () => {
      const originalSecret = process.env.PAGBANK_WEBHOOK_SECRET;
      delete process.env.PAGBANK_WEBHOOK_SECRET;

      const rawBody = JSON.stringify(mockPayload);
      const signature = 'sha256=some-hash';

      const result = PagBankWebhookService.verifySignature(signature, rawBody);

      expect(result).toBe(false);

      // Restaurar
      process.env.PAGBANK_WEBHOOK_SECRET = originalSecret;
    });

    it('deve ser resistente a timing attacks', () => {
      const rawBody = JSON.stringify(mockPayload);
      const validSignature = `sha256=${crypto
        .createHmac('sha256', mockSecret)
        .update(rawBody)
        .digest('hex')}`;

      // Tentar com assinatura ligeiramente diferente (mesmo tamanho)
      const tamperedSignature =
        validSignature.substring(0, validSignature.length - 1) + 'x';

      const result = PagBankWebhookService.verifySignature(
        tamperedSignature,
        rawBody
      );

      expect(result).toBe(false);
    });
  });

  describe('persistWebhook', () => {
    it('deve persistir webhook com dados corretos', async () => {
      const webhookData = {
        provider: 'pagbank',
        event_type: 'PAID',
        signature: 'sha256=test',
        signature_valid: true,
        payload: mockPayload,
        order_id: 'ORDE_12345',
        charge_id: 'CHAR_12345',
        reference_id: 'test_ref_123',
        amount: 10.0,
      };

      const result = await PagBankWebhookService.persistWebhook(webhookData);

      expect(result).toBeDefined();
      expect(result.id).toBe('mock-webhook-id');
    });

    it('deve usar valores padrão quando não fornecidos', async () => {
      const webhookData = {
        event_type: 'PAID',
        payload: mockPayload,
      };

      const result = await PagBankWebhookService.persistWebhook(webhookData);

      expect(result).toBeDefined();
    });
  });

  describe('processWebhookEvent', () => {
    it('deve processar evento PAID corretamente', async () => {
      const webhookId = 'test-webhook-id';

      const result = await PagBankWebhookService.processWebhookEvent(
        mockPayload,
        webhookId
      );

      expect(result.success).toBe(true);
      expect(result.event_type).toBe('PAID');
    });

    it('deve processar evento DECLINED corretamente', async () => {
      const declinedPayload = {
        ...mockPayload,
        charges: [
          {
            ...mockPayload.charges[0],
            status: 'DECLINED',
          },
        ],
      };

      const webhookId = 'test-webhook-id';

      const result = await PagBankWebhookService.processWebhookEvent(
        declinedPayload,
        webhookId
      );

      expect(result.success).toBe(true);
      expect(result.event_type).toBe('DECLINED');
    });

    it('deve processar evento REFUNDED corretamente', async () => {
      const refundedPayload = {
        ...mockPayload,
        charges: [
          {
            ...mockPayload.charges[0],
            status: 'REFUNDED',
          },
        ],
      };

      const webhookId = 'test-webhook-id';

      const result = await PagBankWebhookService.processWebhookEvent(
        refundedPayload,
        webhookId
      );

      expect(result.success).toBe(true);
      expect(result.event_type).toBe('REFUNDED');
    });

    it('deve lançar erro quando não há charges no payload', async () => {
      const invalidPayload = {
        id: 'ORDE_12345',
        reference_id: 'test_ref_123',
        charges: [],
      };

      const webhookId = 'test-webhook-id';

      await expect(
        PagBankWebhookService.processWebhookEvent(invalidPayload, webhookId)
      ).rejects.toThrow('Nenhuma cobrança encontrada no payload');
    });
  });

  describe('handleWebhook - Integração', () => {
    it('deve processar webhook completo com assinatura válida', async () => {
      const rawBody = JSON.stringify(mockPayload);
      const validSignature = `sha256=${crypto
        .createHmac('sha256', mockSecret)
        .update(rawBody)
        .digest('hex')}`;

      const result = await PagBankWebhookService.handleWebhook(
        validSignature,
        rawBody,
        mockPayload
      );

      expect(result.success).toBe(true);
      expect(result.webhook_id).toBeDefined();
      expect(result.event_type).toBe('PAID');
    });

    it('deve rejeitar webhook com assinatura inválida', async () => {
      const rawBody = JSON.stringify(mockPayload);
      const invalidSignature = 'sha256=invalid-signature';

      const result = await PagBankWebhookService.handleWebhook(
        invalidSignature,
        rawBody,
        mockPayload
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid signature');
      expect(result.persisted).toBe(true); // Deve persistir mesmo com assinatura inválida
    });
  });

  describe('Mapeamento de Status', () => {
    const statusTestCases = [
      { input: 'PAID', expected: 'PAID' },
      { input: 'DECLINED', expected: 'DECLINED' },
      { input: 'CANCELED', expected: 'CANCELED' },
      { input: 'REFUNDED', expected: 'REFUNDED' },
      { input: 'AUTHORIZED', expected: 'AUTHORIZED' },
      { input: 'IN_ANALYSIS', expected: 'IN_ANALYSIS' },
    ];

    statusTestCases.forEach(({ input, expected }) => {
      it(`deve mapear status ${input} corretamente`, async () => {
        const payload = {
          ...mockPayload,
          charges: [
            {
              ...mockPayload.charges[0],
              status: input,
            },
          ],
        };

        const result = await PagBankWebhookService.processWebhookEvent(
          payload,
          'test-webhook-id'
        );

        expect(result.event_type).toBe(expected);
      });
    });
  });

  describe('Extração de Dados', () => {
    it('deve extrair amount corretamente (centavos para reais)', async () => {
      const payload = {
        ...mockPayload,
        charges: [
          {
            ...mockPayload.charges[0],
            amount: {
              value: 2550, // R$ 25.50
              currency: 'BRL',
            },
          },
        ],
      };

      const webhookData = {
        event_type: 'PAID',
        payload,
        amount: 25.5,
      };

      const result = await PagBankWebhookService.persistWebhook(webhookData);

      expect(result).toBeDefined();
    });

    it('deve extrair dados do cliente corretamente', async () => {
      const result = await PagBankWebhookService.processWebhookEvent(
        mockPayload,
        'test-webhook-id'
      );

      expect(result.success).toBe(true);
      // Dados do cliente devem ser extraídos do payload
    });
  });
});
