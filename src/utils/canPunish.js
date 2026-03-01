function canPunish({ executorMember, targetMember, botMember, guildOwnerId }) {
  if (!executorMember || !targetMember || !botMember) {
    return { ok: false, reason: "⚠️ Não consegui verificar hierarquia de cargos." };
  }

  if (targetMember.id === executorMember.id) {
    return { ok: false, reason: "⚠️ Você não pode punir a si mesmo." };
  }

  if (targetMember.id === guildOwnerId) {
    return { ok: false, reason: "⚠️ Você não pode punir o soberano (dono do servidor)." };
  }

  if (targetMember.id === botMember.id) {
    return { ok: false, reason: "⚠️ Você não pode punir o Senescal." };
  }

  // Hierarquia: executor precisa estar acima do alvo
  if (executorMember.roles.highest.position <= targetMember.roles.highest.position) {
    return { ok: false, reason: "⚠️ Você não pode punir alguém com cargo igual ou superior ao seu." };
  }

  // Bot precisa estar acima do alvo
  if (botMember.roles.highest.position <= targetMember.roles.highest.position) {
    return { ok: false, reason: "⚠️ Eu (Senescal) não tenho hierarquia para punir esse cargo. Suba meu cargo." };
  }

  return { ok: true };
}

module.exports = { canPunish };
