import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactPayload,
  checkRateLimit,
  filterProjectsByCategory,
  filterSkills,
  buildWhatsAppLink,
  computeCardTilt,
  computeParallaxOffset,
} from './portfolioLogic';

test('validateContactPayload rejects empty fields with clear Portuguese errors', () => {
  const res = validateContactPayload({
    name: '',
    email: 'invalido',
    serviceType: '',
    description: 'curto',
  });
  assert.equal(res.valid, false);
  assert.ok(res.errors.name);
  assert.ok(res.errors.email);
  assert.ok(res.errors.serviceType);
  assert.ok(res.errors.description);
});

test('validateContactPayload accepts valid technical contact request and sanitizes HTML', () => {
  const res = validateContactPayload({
    name: '  Carlos Mendes <script>  ',
    email: 'CARLOS@empresa.com.br ',
    serviceType: 'Implantação de Servidores',
    description: 'Precisamos configurar um servidor Linux com rotinas de backup e controle de acesso.',
  });
  assert.equal(res.valid, true);
  assert.equal(Object.keys(res.errors).length, 0);
  assert.equal(res.sanitized.name, 'Carlos Mendes script');
  assert.equal(res.sanitized.email, 'carlos@empresa.com.br');
});

test('checkRateLimit enforces window limit and calculates retryAfterSeconds', () => {
  const map = new Map<string, number[]>();
  const now = 1_000_000;
  assert.equal(checkRateLimit(map, 'ip-1', now, 60_000, 2).allowed, true);
  assert.equal(checkRateLimit(map, 'ip-1', now + 1000, 60_000, 2).allowed, true);
  const blocked = checkRateLimit(map, 'ip-1', now + 2000, 60_000, 2);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 58);
});

test('filterProjectsByCategory returns all for Todos and filters specific category', () => {
  const items = [
    { id: '1', category: 'Desenvolvimento web' as const },
    { id: '2', category: 'Infraestrutura de TI' as const },
  ];
  assert.equal(filterProjectsByCategory(items, 'Todos').length, 2);
  assert.equal(filterProjectsByCategory(items, 'Infraestrutura de TI').length, 1);
  assert.equal(filterProjectsByCategory(items, 'Infraestrutura de TI')[0].id, '2');
});

test('filterSkills filters by category and qualitative level', () => {
  const skills = [
    { name: 'Python', category: 'Desenvolvimento' as const, level: 'Experiência' as const },
    { name: 'PostgreSQL', category: 'Banco de Dados' as const, level: 'Conhecimento prático' as const },
    { name: 'Docker', category: 'Ferramentas' as const, level: 'Em aprendizado' as const },
  ];
  assert.equal(filterSkills(skills, 'Todos', 'Todos').length, 3);
  assert.equal(filterSkills(skills, 'Banco de Dados', 'Todos').length, 1);
  assert.equal(filterSkills(skills, 'Todos', 'Em aprendizado')[0].name, 'Docker');
});

test('buildWhatsAppLink generates pre-filled message URL with or without phone number', () => {
  const linkWithPhone = buildWhatsAppLink({
    phone: '+55 (11) 98888-7777',
    name: 'Ana',
    serviceType: 'Redes e Infraestrutura',
  });
  assert.ok(linkWithPhone.startsWith('https://wa.me/5511988887777?text='));
  assert.ok(decodeURIComponent(linkWithPhone).includes('Ana'));
  assert.ok(decodeURIComponent(linkWithPhone).includes('Redes e Infraestrutura'));

  const linkWithoutPhone = buildWhatsAppLink({
    serviceType: 'Suporte Técnico',
  });
  assert.ok(linkWithoutPhone.startsWith('https://api.whatsapp.com/send?text='));
});

test('computeCardTilt and computeParallaxOffset respect movement bounds', () => {
  const tilt = computeCardTilt(1.5, -1.5, 6);
  assert.equal(tilt.rotateY, 6);
  assert.equal(tilt.rotateX, 6);

  assert.equal(computeParallaxOffset(1000, 0.5, 180), 180);
  assert.equal(computeParallaxOffset(200, 0.25, 180), 50);
});
