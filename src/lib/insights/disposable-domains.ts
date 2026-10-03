const DOMAINS = `
mailinator.com mailinator.net mailinator.org guerrillamail.com guerrillamail.net
guerrillamail.org guerrillamail.biz guerrillamail.de guerrillamail.info guerrillamailblock.com
sharklasers.com grr.la pokemail.net spam4.me tempmail.com temp-mail.org temp-mail.io
tempmailo.com tempmail.plus tempmail.dev tempmail.email tempmailaddress.com tempemails.io
tempmailer.com 10minutemail.com 10minutemail.net 10mail.org 20minutemail.com yopmail.com
yopmail.fr yopmail.net yopmail.pp.ua yopmail.gq trashmail.com trashmail.de trashmail.net
trashmail.org trashmail.ws trash-mail.com getnada.com dropmail.me dispostable.com
mailnesia.com maildrop.cc mohmal.com emailondeck.com throwawaymail.com throwaway.email
fakeinbox.com inboxkitten.com spamgourmet.com spamgourmet.net mytemp.email tempail.com
discard.email mailcatch.com mintemail.com mailnull.com spambox.us tempinbox.com
tempr.email tmpmail.net tmpmail.org moakt.com emailfake.com generator.email fakemail.net
33mail.com spamdecoy.net jetable.org jetable.fr.nf courriel.fr.nf meltmail.com
spamspot.com trashymail.com cool.fr.nf nospam.ze.tc nomail.xl.cx mega.zik.dj speed.1s.fr
courrieltemporaire.com armyspy.com cuvox.de dayrep.com einrot.com fleckens.hu gustr.com
jourrapide.com rhyta.com superrito.com teleworm.us trbvm.com mailforspam.com
safetymail.info spamfree24.org spamfree.eu oneoffemail.com mailbox.in.ua mailtemp.net
byom.de sogetthis.com mailmetrash.com spamavert.com mytrashmail.com mt2009.com mt2014.com
disposablemail.com mail-temporaire.fr emailtemporario.com.br lroid.com getairmail.com
crazymailing.com minuteinbox.com inboxalias.com mailpoof.com burnermail.io guerrillamail.biz
tempail.com trashmail.io fakemailgenerator.com mailinator2.com tmpeml.com emltmp.com
10minemail.com tempmail.net discardmail.com spamgob.com mailnesia.com yopmail.es
guerrillamailblock.com mailnull.com spam4.me tempinbox.co maildrop.cc inboxbear.com
throwawaymail.org tempmailo.com mailcatch.com fakemail.fr yopmail.co
`.split(/\s+/).map((domain) => domain.trim().toLowerCase()).filter(Boolean);

export const DISPOSABLE_EMAIL_DOMAINS = new Set(DOMAINS);

export function isDisposableEmailDomain(domain: string): boolean {
  const normalized = domain.trim().toLowerCase();
  const parts = normalized.split(".").filter(Boolean);
  if (parts.length < 2) return false;
  for (let index = 0; index <= parts.length - 2; index += 1) {
    if (DISPOSABLE_EMAIL_DOMAINS.has(parts.slice(index).join("."))) return true;
  }
  return false;
}
