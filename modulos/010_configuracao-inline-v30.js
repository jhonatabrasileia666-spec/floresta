
// Altere estes valores e recarregue o HTML. Ângulos em graus; distâncias em metros.
window.FLORESTA_TFP_CONFIG = {
  maxHeadYaw: 70,
  comfortableYaw: 40,
  bodyTurnYaw: 62,
  bodyRecoverYaw: 3,
  headRotationSmoothing: 16,
  bodyRotationSmoothing: 3.5,
  cameraSmoothing: 22,
  bodyRealignSpeed: 120, // graus por segundo, limite de giro do corpo
  maxPitchDown: 88,
  maxPitchUp: 78,
  walkSpeed: 3.0,
  runSpeed: 5.6,
  crouchSpeed: 1.4,
  crouchDepth: 0.34,
  crouchSmoothing: 10,
  walkBob: 0.004,
  runBob: 0.008,
  idleBob: 0.0006
};


// Ciclo de dia e noite.
// Um ciclo completo usa "cycleMinutes" minutos reais.
// Pressione N no jogo para alternar entre velocidade normal e aceleração de teste.
window.FLORESTA_DAY_NIGHT_CONFIG = {
  enabled: true,
  startHour: 16.75,       // 16:45 — começa perto do entardecer para a transição aparecer logo
  cycleMinutes: 12,       // 24 horas do jogo em 12 minutos reais
  fastMultiplier: 12,     // velocidade ao pressionar N
  sunriseHour: 6.0,
  sunsetHour: 18.0,
  showClock: true,
  fogDayDensity: 0.022,
  fogNightDensity: 0.034,
  dayExposure: 1.12,
  nightExposure: 0.88
};

