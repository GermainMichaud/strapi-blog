const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.article.findOne({ slug });

    return sanitizeEntity(entity, { model: strapi.models.article });
  },

  async related(ctx) {
    const { slug } = ctx.params;
    // On récupère l'article en question
    const article = await strapi.services.article.findOne({ slug });

    // On crée un objet avec l'article et un tableau vide qui contiendra les 2 derniers articles
    let response = { ...article, suggested: [] };

    // On crée une promesse afin d'attendre que l'on ai bien tous les articles
    return new Promise((resolve, reject) => {
      // On fait une boucle sur toutes les catégoriées associées à l'article que l'on veut
      article.categories.map(async (category, mapIndex) => {
        // On récupère la catégorie et par ce fait les articles associés
        const cat = await strapi.services.category.findOne({
          _where: { name: category.name },
        });
        // On boucle sur chacun des articles de la catégorie
        cat.articles.forEach((data, index) => {
          // Si l'article en cours dans la boucle n'est pas l'article d'origine que l'on cherche (ligne 21) alors on l'ajoute dans le tableau
          if (data.id !== article.id) {
            response.suggested.push(data);
          }
          // Si on a bouclé sur tous les articles de la catégorie et sur toutes les catégories alors on est bon
          if (
            index === cat.articles.length - 1 &&
            mapIndex === article.categories.length - 1
          ) {
            // Ici on classe dans l'ordre décroissant les articles par date de publication
            response.suggested = response.suggested.sort((a, b) => {
              if (
                new Date(a.published_at).getTime() <
                new Date(b.published_at).getTime()
              )
                return 1;
              if (
                new Date(a.published_at).getTime() >
                new Date(b.published_at).getTime()
              )
                return -1;
              return 0;
            });
            // On ne garde que les 2 premiers articles (les plus récents)
            response.suggested.length = 2;
            // On résolve donc '.then'
            resolve();
          }
        });
      });
    }).then(() => {
      // Après le 'resolve()', on peut enfin retourner les données
      return sanitizeEntity(response, { model: strapi.models.article });
    });
  },
};
