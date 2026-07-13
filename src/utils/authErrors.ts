const authErrorMessages: Record<string, string> = {
  "Invalid login credentials": "Adresse e-mail ou mot de passe incorrect.",
  "User not found": "Utilisateur introuvable. Vérifiez votre adresse e-mail.",
  "Email not confirmed":
    "Veuillez confirmer votre adresse e-mail avant de vous connecter.",
  "Password should be at least":
    "Le mot de passe doit contenir au moins 6 caractères.",
  "Network request failed":
    "Erreur réseau. Vérifiez votre connexion et réessayez.",
  "Invalid verification token":
    "Le lien de vérification n'est pas valide ou a expiré.",
  "Invalid login": "Adresse e-mail ou mot de passe incorrect.",
};

export function translateAuthError(message: string) {
  if (!message) {
    return "Une erreur est survenue. Veuillez réessayer.";
  }

  const normalized = message.toLowerCase();

  for (const [key, translation] of Object.entries(authErrorMessages)) {
    if (normalized.includes(key.toLowerCase())) {
      return translation;
    }
  }

  return message;
}
