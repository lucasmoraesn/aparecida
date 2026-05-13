/** Rota única do guia “O que fazer” (âncoras em branco para estilização posterior) */
export const O_QUE_FAZER_GUIA_PATH = '/o-que-fazer-em-aparecida-sp';

/** Itens do submenu "O que fazer" (Header) — cada um aponta para uma âncora na página guia */
export const O_QUE_FAZER_NAV_ITEMS: { label: string; to: string }[] = [
  { label: 'Basílica Histórica', to: `${O_QUE_FAZER_GUIA_PATH}#basilica-historica` },
  { label: 'Eventos', to: `${O_QUE_FAZER_GUIA_PATH}#eventos` },
  { label: 'Feira de Aparecida', to: `${O_QUE_FAZER_GUIA_PATH}#feira-de-aparecida` },
  { label: 'Mirante da Santa', to: `${O_QUE_FAZER_GUIA_PATH}#miranta-da-santa` },
  { label: 'Mirante das Pedras', to: `${O_QUE_FAZER_GUIA_PATH}#mirante-das-pedras` },
  { label: 'Morro do Cruzeiro', to: `${O_QUE_FAZER_GUIA_PATH}#morro-do-cruzeiro` },
  { label: 'Morro do Presépio', to: `${O_QUE_FAZER_GUIA_PATH}#morro-do-presepio` },
  { label: 'Paróquia Nossa Senhora', to: `${O_QUE_FAZER_GUIA_PATH}#paroquia-nossa-senhora` },
  { label: 'Passarela', to: `${O_QUE_FAZER_GUIA_PATH}#passarela` },
  { label: 'Passarela da Fé', to: `${O_QUE_FAZER_GUIA_PATH}#passarela-da-fe` },
  { label: 'Porto Itaguaçu', to: `${O_QUE_FAZER_GUIA_PATH}#porto-itaguacu` },
  { label: 'Sala dos Milagres', to: `${O_QUE_FAZER_GUIA_PATH}#sala-dos-milagres` },
  { label: 'Santuário Nacional', to: `${O_QUE_FAZER_GUIA_PATH}#santuario-nacional` },
  { label: 'Teleférico Aparecida', to: `${O_QUE_FAZER_GUIA_PATH}#teleferico-aparecida` },
  { label: 'Torre da Basílica', to: `${O_QUE_FAZER_GUIA_PATH}#torre-da-basilica` },
];

/** IDs das seções na página guia (derivados do menu, mesma ordem alfabética do label) */
export const O_QUE_FAZER_ANCHOR_IDS: readonly string[] = O_QUE_FAZER_NAV_ITEMS.map((item) => {
  const prefix = `${O_QUE_FAZER_GUIA_PATH}#`;
  if (!item.to.startsWith(prefix)) return '';
  return decodeURIComponent(item.to.slice(prefix.length));
}).filter(Boolean);
