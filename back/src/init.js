const { createCategories, removeOlderThanDays, updateProductDifference, updateProductsNoAttr } = require("./database/database_actions");
const { db } = require("./db_connection");
const { scrappeCarrefour, getLolaMarketInfo } = require("./scrapper");

const links_scrapping = [
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/frutas-y-verduras/fruta/", tag: ["frutas", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/frutas-y-verduras/verduras/", tag: ["verduras", "superMercado"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/lacteos-y-huevos/leche/", tag: ["lacteos", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/lacteos-y-huevos/mantequillas-y-margarinas/", tag: ["superMercado", "lacteos", "mantequillas"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/lacteos-y-huevos/postres-y-yogures/", tag: ["superMercado", "lacteos", "postres", "yogures"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/lacteos-y-huevos/quesos/", tag: ["lacteos", "quesos", "superMercado"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/agua/", tag: ["bebidas", "agua", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/cerveza/", tag: ["bebidas", "cerveza", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/licores-y-alcohol/", tag: ["bebidas", "alcohol", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/refrescos/", tag: ["bebidas", "refrescos", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/sidras-y-cavas/", tag: ["bebidas", "sidras", "cavas", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/vinos/", tag: ["bebidas", "vinos", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/bebidas/zumos/", tag: ["bebidas", "zumos", "superMercado"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/desayuno-y-panaderia/bolleria/", tag: ["desayuno", "bollería", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/desayuno-y-panaderia/desayuno/", tag: ["desayuno", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/desayuno-y-panaderia/panaderia/", tag: ["panaderia", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/desayuno-y-panaderia/reposteria/", tag: ["panaderia", "superMercado", "respotería"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/carnes/aves-y-conejo/", tag: ["carnes", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/carnes/carne-picada-y-hamburguesas/", tag: ["carnes", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/carnes/cerdo/", tag: ["carnes", "superMercado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/carnes/fiambres-y-embutidos/", tag: ["carnes", "superMercado", "embutidos"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/carnes/varios/", tag: ["carnes", "superMercado"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/limpieza-y-hogar/ambientadores/", tag: ["superMercado", "limpieza", "hogar", "ambientadores"], shop: "carrefour" },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/limpieza-y-hogar/detergentes-y-suavizantes/",
    tag: ["limpieza", "hogar", "detergentes", "suavizantes", "superMercado"],
    shop: "carrefour",
  },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/limpieza-y-hogar/limpieza-del-hogar/", tag: ["superMercado", "limpieza", "hogar"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/limpieza-y-hogar/menaje-del-hogar/", tag: ["superMercado", "limpieza", "hogar", "menaje"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/limpieza-y-hogar/ropa-y-calzado/", tag: ["superMercado", "limpieza", "hogar", "calzado"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/botiquin/", tag: ["superMercado", "higiene", "belleza", "botiquin"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/depilacion-y-afeitado/", tag: ["superMercado", "higiene", "belleza", "afeitado"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/champu-y-suavizante/", tag: ["superMercado", "higiene", "belleza", "champu"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/colonias/", tag: ["superMercado", "higiene", "belleza", "colonias"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/jabon-y-geles/", tag: ["superMercado", "higiene", "belleza", "geles"], shop: "carrefour" },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/cremas-y-belleza/", tag: ["superMercado", "higiene", "belleza"], shop: "carrefour" },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/desodorantes-y-dentifricos/",
    tag: ["superMercado", "higiene", "belleza", "desodorantes", "dentifricos"],
    shop: "carrefour",
  },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/higiene-y-belleza/higiene-femenina/", tag: ["superMercado", "higiene", "belleza", "femenina"], shop: "carrefour" },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/conservas-de-carne/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/conservas-de-pescado/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/conservas-vegetales/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/mermeladas-y-miel/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/pates/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/enlatados-y-conservas/platos-preparados/", shop: "carrefour", tag: ["superMercado", "enlatados", "conservas"] },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/carnes/", shop: "carrefour", tag: ["superMercado", "refrigerados", "congelados", "carnes"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/helados/", shop: "carrefour", tag: ["superMercado", "refrigerados", "congelados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/pescado-y-marisco/",
    shop: "carrefour",
    tag: ["superMercado", "refrigerados", "congelados", "pescado", "marisco"],
  },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/pizzas/", shop: "carrefour", tag: ["superMercado", "refrigerados", "congelados", "pizza"] },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/platos-preparados/",
    shop: "carrefour",
    tag: ["superMercado", "refrigerados", "congelados"],
  },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/tartas-y-reposteria/",
    shop: "carrefour",
    tag: ["superMercado", "refrigerados", "congelados"],
  },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/varios/", shop: "carrefour", tag: ["superMercado", "refrigerados", "congelados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/verduras/",
    shop: "carrefour",
    tag: ["superMercado", "refrigerados", "congelados", "verduras"],
  },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/aceites-salsas-y-condimentos/aceites-y-vinagres/", shop: "carrefour", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/aceites-salsas-y-condimentos/caldos-y-cremas/", shop: "carrefour", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/aceites-salsas-y-condimentos/sal-y-especias/", shop: "carrefour", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/aceites-salsas-y-condimentos/salsas/", shop: "carrefour", tag: ["superMercado", "aceites", "salsas"] },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/pasta-legumbres-y-arroz/arroz/", shop: "carrefour", tag: ["superMercado", "arroz"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/pasta-legumbres-y-arroz/legumbres/", shop: "carrefour", tag: ["superMercado", "legumbres"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/pasta-legumbres-y-arroz/pasta/", shop: "carrefour", tag: ["superMercado", "pasta"] },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/pescados-y-mariscos/ahumados/", shop: "carrefour", tag: ["superMercado", "pescados", "mariscos", "ahumados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/pescados-y-mariscos/marisco-y-moluscos/",
    shop: "carrefour",
    tag: ["superMercado", "pescados", "mariscos", "moluscos"],
  },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/pescados-y-mariscos/pescados/", shop: "carrefour", tag: ["superMercado", "pescados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/pescados-y-mariscos/pulpo-sepia-y-calamares/",
    shop: "carrefour",
    tag: ["superMercado", "pulpo", "sepia", "calamares"],
  },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/cafes-cacaos-e-infusiones/cacaos/", shop: "carrefour", tag: ["superMercado", "cafes", "infusiones", "te"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/cafes-cacaos-e-infusiones/cafes/", shop: "carrefour", tag: ["superMercado", "cafes", "infusiones", "te"] },

  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/cuidado-e-higiene/", shop: "carrefour", tag: ["superMercado", "bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/panales/", shop: "carrefour", tag: ["bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/tarros-y-papillas/", shop: "carrefour", tag: ["superMercado", "bebé"] },
  /* Lidl supermarket */
  { link: "https://lolamarket.com/es/es/tienda/lidl/frutas-y-verduras/fruta/", tag: ["frutas", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/frutas-y-verduras/verduras/", tag: ["verduras", "superMercado"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/huevos", tag: ["huevos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/leche/", tag: ["lacteos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/mantequillas-y-margarinas/", tag: ["superMercado", "lacteos", "mantequillas"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/postres-y-yogures/", tag: ["superMercado", "lacteos", "postres", "yogures"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/quesos/", tag: ["lacteos", "quesos", "superMercado"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/agua/", tag: ["bebidas", "agua", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/bebidas-vegetales/", tag: ["bebidas", "superMercado"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/cerveza/", tag: ["bebidas", "cerveza", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/licores-y-alcohol/", tag: ["bebidas", "alcohol", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/refrescos/", tag: ["bebidas", "refrescos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/sidras-y-cavas/", tag: ["bebidas", "sidras", "cavas", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/vinos/", tag: ["bebidas", "vinos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/zumos/", tag: ["bebidas", "zumos", "superMercado"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/desayuno-y-panaderia/bolleria/", tag: ["desayuno", "bollería", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/desayuno-y-panaderia/desayuno/", tag: ["desayuno", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/desayuno-y-panaderia/panaderia/", tag: ["panaderia", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/desayuno-y-panaderia/pasteleria/", tag: ["pasteleria", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/desayuno-y-panaderia/reposteria/", tag: ["panaderia", "superMercado", "respotería"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/aves-y-conejo/", tag: ["carnes", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/cerdo/", tag: ["carnes", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/cordero/", tag: ["carnes", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/fiambres-y-embutidos/", tag: ["carnes", "superMercado", "embutidos"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/ternera-y-buey/", tag: ["carnes", "superMercado"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/ambientadores/", tag: ["superMercado", "limpieza", "hogar", "ambientadores"], shop: "lidl" },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/detergentes-y-suavizantes/",
    tag: ["limpieza", "hogar", "detergentes", "suavizantes", "superMercado"],
    shop: "lidl",
  },

  { link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/limpieza-del-hogar/", tag: ["superMercado", "limpieza", "hogar"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/menaje-del-hogar/", tag: ["superMercado", "limpieza", "hogar", "menaje"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/botiquin/", tag: ["superMercado", "higiene", "belleza", "botiquin"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/champu-y-suavizante/", tag: ["superMercado", "higiene", "belleza", "champu"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/colonias/", tag: ["superMercado", "higiene", "belleza", "colonias"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/jabon-y-geles/", tag: ["superMercado", "higiene", "belleza", "geles"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/cremas-y-belleza/", tag: ["superMercado", "higiene", "belleza"], shop: "lidl" },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/desodorantes-y-dentifricos/",
    tag: ["superMercado", "higiene", "belleza", "desodorantes", "dentifricos"],
    shop: "lidl",
  },
  { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/higiene-femenina/", tag: ["superMercado", "higiene", "belleza", "femenina"], shop: "lidl" },

  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/conservas-de-pescado/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/conservas-vegetales/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/mermeladas-y-miel/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/pates/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/platos-preparados/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/helados/", shop: "lidl", tag: ["superMercado", "refrigerados", "congelados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/pescado-y-marisco/",
    shop: "lidl",
    tag: ["superMercado", "refrigerados", "congelados", "pescado", "marisco"],
  },
  { link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/pizzas/", shop: "lidl", tag: ["superMercado", "refrigerados", "congelados", "pizza"] },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/platos-preparados/",
    shop: "lidl",
    tag: ["superMercado", "refrigerados", "congelados"],
  },
  { link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/varios/", shop: "lidl", tag: ["superMercado", "refrigerados", "congelados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/verduras/",
    shop: "lidl",
    tag: ["superMercado", "refrigerados", "congelados", "verduras"],
  },

  { link: "https://lolamarket.com/es/es/tienda/lidl/aceites-salsas-y-condimentos/aceites-y-vinagres/", shop: "lidl", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/aceites-salsas-y-condimentos/caldos-y-cremas/", shop: "lidl", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/aceites-salsas-y-condimentos/sal-y-especias/", shop: "lidl", tag: ["superMercado", "aceites", "salsas"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/aceites-salsas-y-condimentos/salsas/", shop: "lidl", tag: ["superMercado", "aceites", "salsas"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/snacks-y-variantes/aperitivos/", shop: "lidl", tag: ["superMercado", "snacks", "aperitivos"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/snacks-y-variantes/chocolates-y-bombones/", shop: "lidl", tag: ["superMercado", "snacks", "chocolate"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/snacks-y-variantes/dulces/", shop: "lidl", tag: ["superMercado", "dulces"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/snacks-y-variantes/frutos-secos/", shop: "lidl", tag: ["superMercado", "snacks"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/arroz/", shop: "lidl", tag: ["superMercado", "arroz"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/legumbres/", shop: "lidl", tag: ["superMercado", "legumbres"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/pasta/", shop: "lidl", tag: ["superMercado", "pasta"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/ahumados/", shop: "lidl", tag: ["superMercado", "pescados", "mariscos", "ahumados"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/pescados/", shop: "lidl", tag: ["superMercado", "pescados"] },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/pulpo-sepia-y-calamares/",
    shop: "lidl",
    tag: ["superMercado", "pulpo", "sepia", "calamares"],
  },

  { link: "https://lolamarket.com/es/es/tienda/lidl/cafes-cacaos-e-infusiones/cacaos/", shop: "lidl", tag: ["superMercado", "cafes", "infusiones", "te"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/cafes-cacaos-e-infusiones/cafes/", shop: "lidl", tag: ["superMercado", "cafes", "infusiones", "te"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/cafes-cacaos-e-infusiones/infusiones-y-te/", shop: "lidl", tag: ["superMercado", "cafes", "infusiones", "te"] },

  { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/cuidado-e-higiene/", shop: "lidl", tag: ["superMercado", "bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/bebidas/", shop: "lidl", tag: ["bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/tarros-y-papillas/", shop: "lidl", tag: ["superMercado", "bebé"] },
];
const test_scrapping = [
  {
    link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/tartas-y-reposteria/",
    shop: "carrefour",
    tag: ["superMercado", "refrigerados", "congelados"],
  },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/cafes-cacaos-e-infusiones/infusiones-y-te/", shop: "carrefour", tag: ["superMercado", "cafes", "infusiones", "te"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/cuidado-e-higiene/", shop: "carrefour", tag: ["superMercado", "bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/panales/", shop: "carrefour", tag: ["bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/carrefour-es/ninos-y-bebes/tarros-y-papillas/", shop: "carrefour", tag: ["superMercado", "bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/frutas-y-verduras/verduras/", tag: ["verduras", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/leche/", tag: ["lacteos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/quesos/", tag: ["lacteos", "quesos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/bebidas/refrescos/", tag: ["bebidas", "refrescos", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/cerdo/", tag: ["carnes", "superMercado"], shop: "lidl" },
  { link: "https://lolamarket.com/es/es/tienda/lidl/limpieza-y-hogar/menaje-del-hogar/", tag: ["superMercado", "limpieza", "hogar", "menaje"], shop: "lidl" },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/desodorantes-y-dentifricos/",
    tag: ["superMercado", "higiene", "belleza", "desodorantes", "dentifricos"],
    shop: "lidl",
  },
  { link: "https://lolamarket.com/es/es/tienda/lidl/enlatados-y-conservas/mermeladas-y-miel/", shop: "lidl", tag: ["superMercado", "enlatados", "conservas"] },
  {
    link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/platos-preparados/",
    shop: "lidl",
    tag: ["superMercado", "refrigerados", "congelados"],
  },

  { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/arroz/", shop: "lidl", tag: ["superMercado", "arroz"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/pasta/", shop: "lidl", tag: ["superMercado", "pasta"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/pescados/", shop: "lidl", tag: ["superMercado", "pescados"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/cuidado-e-higiene/", shop: "lidl", tag: ["superMercado", "bebé"] },
  { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/bebidas/", shop: "lidl", tag: ["bebé"] },
];
db.once("open", () => {
  console.log("Database connected");
  //initProcess();

  initLola();
});
const initProcess = async () => {
  // Create all categories if not exists
  //await createCategories();
  await removeOlderThanDays(10);
  console.log("Finished remove old products");
  await scrappeCarrefour();
  //await updateProductDifference();
  //await updateProductsNoAttr();
};

const initLola = async () => {
  const arrayScrapping = [
    { link: "https://lolamarket.com/es/es/tienda/carrefour-es/refrigerados-y-congelados/varios/", shop: "carrefour", tag: ["superMercado", "refrigerados", "congelados"] },
    { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/huevos", tag: ["huevos", "superMercado"], shop: "lidl" },
    { link: "https://lolamarket.com/es/es/tienda/lidl/lacteos-y-huevos/mantequillas-y-margarinas/", tag: ["superMercado", "lacteos", "mantequillas"], shop: "lidl" },
    { link: "https://lolamarket.com/es/es/tienda/lidl/carnes/cordero/", tag: ["carnes", "superMercado"], shop: "lidl" },
    { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/botiquin/", tag: ["superMercado", "higiene", "belleza", "botiquin"], shop: "lidl" },
    { link: "https://lolamarket.com/es/es/tienda/lidl/higiene-y-belleza/higiene-femenina/", tag: ["superMercado", "higiene", "belleza", "femenina"], shop: "lidl" },
    { link: "https://lolamarket.com/es/es/tienda/lidl/refrigerados-y-congelados/varios/", shop: "lidl", tag: ["superMercado", "refrigerados", "congelados"] },
    { link: "https://lolamarket.com/es/es/tienda/lidl/pasta-legumbres-y-arroz/legumbres/", shop: "lidl", tag: ["superMercado", "legumbres"] },
    { link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/ahumados/", shop: "lidl", tag: ["superMercado", "pescados", "mariscos", "ahumados"] },
    {
      link: "https://lolamarket.com/es/es/tienda/lidl/pescados-y-mariscos/pulpo-sepia-y-calamares/",
      shop: "lidl",
      tag: ["superMercado", "pulpo", "sepia", "calamares"],
    },
    { link: "https://lolamarket.com/es/es/tienda/lidl/cafes-cacaos-e-infusiones/cacaos/", shop: "lidl", tag: ["superMercado", "cafes", "infusiones", "te"] },
    { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/tarros-y-papillas/", shop: "lidl", tag: ["superMercado", "bebé"] },
    { link: "https://lolamarket.com/es/es/tienda/lidl/ninos-y-bebes/bebidas/", shop: "lidl", tag: ["bebé"] },
  ];
  const array = [...test_scrapping, ...links_scrapping];
  await getLolaMarketInfo(array, 1);
};
