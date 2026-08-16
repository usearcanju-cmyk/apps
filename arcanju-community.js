/*!
 * ARCANJU — Widget "Compartilhe o seu look"
 * -------------------------------------------------------------------------
 * Como usar (Nuvemshop):
 *
 * 1) Hospede este arquivo e o "photos.json" num repositório público no
 *    GitHub e sirva via jsDelivr, ex:
 *    https://cdn.jsdelivr.net/gh/SEU-USUARIO/SEU-REPO@main/arcanju-community.js
 *
 * 2) Em qualquer página da loja (Home ou Produto), cole isto no bloco de
 *    HTML personalizado / código do tema:
 *
 *    <div class="arcanju-community" data-source="https://cdn.jsdelivr.net/gh/SEU-USUARIO/SEU-REPO@main/photos.json"></div>
 *    <script src="https://cdn.jsdelivr.net/gh/SEU-USUARIO/SEU-REPO@main/arcanju-community.js" defer></script>
 *
 * 3) Na página de produto, se quiser mostrar só quem comprou AQUELE
 *    produto, adicione data-product-handle com o "handle" (slug) do
 *    produto (o mesmo valor usado no campo "product.handle" do JSON):
 *
 *    <div class="arcanju-community" data-source="...photos.json" data-product-handle="{{ product.handle }}"></div>
 *
 * 4) Para atualizar as fotos, edite o "photos.json" no GitHub — não é
 *    necessário mexer no código da loja.
 *
 * Estrutura de dados (photos.json): cada pessoa é um objeto com uma lista
 * "photos". Se tiver mais de 1 foto, o lightbox mostra um carrossel entre
 * elas (cada foto pode ter produto e tamanho diferentes). Ver
 * photos.example.json para o formato completo.
 * -------------------------------------------------------------------------
 */
(function () {
  "use strict";

  var ARC_VERIFIED_LABEL = "Cliente Use Arcanju ✓"; // usado pelo chip da grade, pelo lightbox e pelo player de stories

  var ARC_SEAL_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="currentColor"/><path d="M7 12.3l3.2 3.2L17.5 8" stroke="#161616" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function verifiedBadge(extraClass) {
    return '<span class="arc-verified-badge' + (extraClass ? " " + extraClass : "") + '">' + ARC_SEAL_SVG + '<span>' + ARC_VERIFIED_LABEL + '</span></span>';
  }

  var ARC_ICON_SHIRT = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 2 4-2 4 3-2.5 3L16 8v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l-1.5 1L4 6l4-3z"/></svg>';
  var ARC_ICON_HALO = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="7" rx="6" ry="2.4"/><path d="M6 15c0-3 2.5-4 6-4s6 1 6 4-2.5 5-6 5-6-2-6-5z"/><path d="M9 11v6M15 11v6"/></svg>';
  var ARC_ICON_CHEVRON = '<svg class="arc-accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var ARC_ICON_STAR_FILLED = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>';
  var ARC_ICON_CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
  var ARC_ICON_AVOID = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M6.5 6.5l11 11"/></svg>';
  var ARC_CARE_ICONS = {
    "no-bleach": '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 4l16 16M4 20L20 4"/><path d="M4 4h16v16H4z" stroke-opacity=".55"/></svg>',
    "dry-low": '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
    "no-dryclean": '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/></svg>',
    "iron-low": '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 17c0-5 3-9 9-9h4a2 2 0 0 1 2 2c0 4-3 7-8 7H6a2 2 0 0 1-2-2z"/><circle cx="9" cy="14.5" r="1" fill="currentColor" stroke="none"/></svg>',
    "wash-cold": '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10z"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/></svg>'
  };

  function starsHTML(rating) {
    var full = Math.round(rating);
    var html = "";
    for (var i = 0; i < 5; i++) {
      html += '<span class="' + (i < full ? "is-filled" : "") + '">' + ARC_ICON_STAR_FILLED + '</span>';
    }
    return html;
  }

  function formatDatePt(dateStr) {
    var d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();

  function init() {
    var roots = document.querySelectorAll(".arcanju-community:not([data-arc-ready])");
    roots.forEach(function (root) {
      root.setAttribute("data-arc-ready", "1");
      var source = root.getAttribute("data-source");
      var storiesSource = root.getAttribute("data-source-stories");
      var productHandle = root.getAttribute("data-product-handle") || null;
      var limit = parseInt(root.getAttribute("data-limit") || "0", 10);

      if (!source) {
        console.error("[arcanju-community] Falta o atributo data-source com a URL do photos.json");
        return;
      }

      function fetchPosts(url) {
        if (!url) return Promise.resolve(null);
        return fetch(url, { cache: "no-store" })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
          })
          .then(function (posts) {
            if (productHandle) {
              posts = posts
                .map(function (p) {
                  var matchIndex = p.photos.findIndex(function (ph) {
                    return ph.product && ph.product.handle === productHandle;
                  });
                  if (matchIndex === -1) return null;
                  return Object.assign({}, p, { _coverIndex: matchIndex });
                })
                .filter(Boolean);
            }
            if (limit > 0) posts = posts.slice(0, limit);
            return posts;
          })
          .catch(function (err) {
            console.error("[arcanju-community] Não foi possível carregar " + url + ":", err);
            return null;
          });
      }

      Promise.all([fetchPosts(source), fetchPosts(storiesSource)]).then(function (results) {
        var communityPosts = results[0] || [];
        var storiesPosts = results[1] || [];
        var categories = [
          { key: "community", label: root.getAttribute("data-tab-community-label") || "Comunidade", posts: communityPosts },
          { key: "stories", label: root.getAttribute("data-tab-stories-label") || "Marcaram no story", posts: storiesPosts }
        ].filter(function (c) { return c.posts && c.posts.length; });

        if (!categories.length) {
          root.style.display = "none";
          return;
        }
        render(root, categories);
      });
    });

    initSizeGuide();
    initProductionStories();
    initProductInfo();
  }

  function initProductInfo() {
    var roots = document.querySelectorAll(".arcanju-product-info:not([data-arc-ready])");
    roots.forEach(function (root) {
      root.setAttribute("data-arc-ready", "1");
      var source = root.getAttribute("data-source");
      if (!source) {
        console.error("[arcanju-product-info] Falta o atributo data-source com a URL do JSON desse produto");
        return;
      }
      fetch(source, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (config) {
          if (!config) { root.style.display = "none"; return; }
          renderArcanjuProductInfo(root, config);
        })
        .catch(function (err) {
          console.error("[arcanju-product-info] Não foi possível carregar " + source + ":", err);
        });
    });
  }

  function initSizeGuide() {
    var roots = document.querySelectorAll(".arcanju-size-guide:not([data-arc-ready])");
    roots.forEach(function (root) {
      root.setAttribute("data-arc-ready", "1");
      var source = root.getAttribute("data-source");
      if (!source) {
        console.error("[arcanju-size-guide] Falta o atributo data-source com a URL do sizes.json");
        return;
      }
      fetch(source, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (fits) {
          if (!fits || !fits.regular || !fits.regular.length) { root.style.display = "none"; return; }
          renderArcanjuSizeGuide(root, {
            title: root.getAttribute("data-title") || "ESCOLHA SEU TAMANHO",
            introText: root.getAttribute("data-intro-text") ||
              "Além da GUIA DE MEDIDAS, veja como cada tamanho veste em nossos clientes e escolha com mais segurança aquele que combina com o caimento que você procura.",
            belowText: root.getAttribute("data-below-text") ||
              "Cada pessoa possui um caimento diferente. Em caso de dúvida, acesse nossa GUIA DE MEDIDAS e compare as medidas com uma camiseta que já veste bem em você.",
            moreButtonText: root.getAttribute("data-more-button-text") || "VER MAIS CLIENTES USANDO",
            scrollTarget: root.getAttribute("data-scroll-target") || ".arcanju-community",
            sizeGuideImage: root.getAttribute("data-size-guide-image"),
            fits: fits
          });
        })
        .catch(function (err) {
          console.error("[arcanju-size-guide] Não foi possível carregar " + source + ":", err);
        });
    });
  }

  function initProductionStories() {
    var roots = document.querySelectorAll(".arcanju-production:not([data-arc-ready])");
    roots.forEach(function (root) {
      root.setAttribute("data-arc-ready", "1");
      var source = root.getAttribute("data-source");
      if (!source) {
        console.error("[arcanju-production] Falta o atributo data-source com a URL do production.json");
        return;
      }
      fetch(source, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (groups) {
          if (!groups || !groups.length) { root.style.display = "none"; return; }
          renderArcanjuProductionStories(root, {
            title: root.getAttribute("data-title") || "POR DENTRO DA USE ARCANJU",
            text: root.getAttribute("data-text") ||
              "Do preparo da sua camiseta até o momento do envio: acompanhe de perto como cada pedido é produzido, conferido e embalado por nossa equipe.",
            groups: groups
          });
        })
        .catch(function (err) {
          console.error("[arcanju-production] Não foi possível carregar " + source + ":", err);
        });
    });
  }

  function render(root, categories) {
    injectStyles();

    var copyTitle = root.getAttribute("data-title") || "COMPARTILHE O SEU LOOK";
    var copyMention = root.getAttribute("data-mention") || "@usearcanju";
    var copyMentionUrl = root.getAttribute("data-mention-url") || ("https://instagram.com/" + copyMention.replace("@", ""));
    var copyText = root.getAttribute("data-text") ||
      ("Essa é uma parte da nossa comunidade! Quer aparecer na nossa galeria? É só marcar " + copyMention +
       " nas suas fotos do Instagram e ela pode ser escolhida para aparecer aqui.");
    var highlightUrl = root.getAttribute("data-highlight-url");
    var trustText = root.getAttribute("data-trust-text") || "✓ Fotos reais de clientes da Use Arcanju";
    ARC_VERIFIED_LABEL = root.getAttribute("data-verified-label") || "Cliente Use Arcanju ✓";

    root.innerHTML =
      '<section class="arc-section">' +
        '<header class="arc-head">' +
          '<h2 class="arc-title">' + escapeHTML(copyTitle) + '</h2>' +
          '<p class="arc-text">' + copyText.replace(copyMention,
            '<a href="' + copyMentionUrl + '" target="_blank" rel="noopener" class="arc-mention">' + copyMention + '</a>') +
          '</p>' +
          '<div class="arc-trust">' +
            ARC_SEAL_SVG +
            '<span class="arc-trust-line">' + escapeHTML(trustText) + '</span>' +
          '</div>' +
        '</header>' +
        '<div class="arc-tabs-row">' +
          (categories.length > 1 ?
            '<div class="arc-tabs" role="tablist">' +
              categories.map(function (c, i) {
                return '<button class="arc-tab' + (i === 0 ? ' is-active' : '') + '" role="tab" data-key="' + c.key + '">' + escapeHTML(c.label) + '</button>';
              }).join('') +
            '</div>' : '<span></span>') +
          (highlightUrl ? '<a class="arc-highlight-link" href="' + highlightUrl + '" target="_blank" rel="noopener">Ver no Instagram ↗</a>' : '') +
        '</div>' +
        '<div class="arc-grid" role="list"></div>' +
        '<button type="button" class="arc-more-btn">VER MAIS</button>' +
      '</section>';

    var grid = root.querySelector(".arc-grid");
    var tabButtons = root.querySelectorAll(".arc-tab");
    var moreBtn = root.querySelector(".arc-more-btn");
    var PAGE_LIMIT = window.matchMedia("(min-width: 641px)").matches ? 10 : 6;
    var currentCat = null;
    var expanded = false;

    function paintGrid(posts, limited) {
      grid.className = "arc-grid";
      grid.innerHTML = "";
      var list = limited ? posts.slice(0, PAGE_LIMIT) : posts;
      list.forEach(function (post, i) {
        var coverIndex = post._coverIndex || 0;
        var igUrl = post.instagram || ("https://instagram.com/" + post.handle);
        var card = document.createElement("div");
        card.className = "arc-card";
        card.setAttribute("role", "listitem");
        card.innerHTML =
          '<div class="arc-card-media">' +
            '<button class="arc-card-trigger" aria-label="Ver look de @' + escapeHTML(post.handle) + '">' +
              '<img class="arc-card-img" src="' + post.photos[coverIndex].image + '" alt="Look de @' + escapeHTML(post.handle) + '" loading="lazy">' +
              (post.photos.length > 1 ?
                '<span class="arc-multi" title="' + post.photos.length + ' fotos">' +
                  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2"/></svg>' +
                '</span>' : '') +
            '</button>' +
            '<a class="arc-badge" href="' + igUrl + '" target="_blank" rel="noopener" aria-label="Abrir perfil de @' + escapeHTML(post.handle) + ' no Instagram">' +
              '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1.3" fill="currentColor"/></svg>' +
              '<span>@' + escapeHTML(post.handle) + '</span>' +
            '</a>' +
          '</div>' +
          '<div class="arc-card-verified">' + verifiedBadge() + '</div>';
        card.querySelector(".arc-card-trigger").addEventListener("click", function () { ArcLightbox.open(list, i, coverIndex); });
        card.querySelector(".arc-badge").addEventListener("click", function (e) { e.stopPropagation(); });
        grid.appendChild(card);
      });
    }

    function paintStoryTray(posts, limited) {
      grid.className = "arc-story-tray";
      grid.innerHTML = "";
      var list = limited ? posts.slice(0, PAGE_LIMIT) : posts;
      list.forEach(function (post, i) {
        var bubble = document.createElement("button");
        bubble.className = "arc-story-bubble";
        bubble.setAttribute("aria-label", "Ver stories de @" + post.handle + " — " + ARC_VERIFIED_LABEL);
        bubble.innerHTML =
          '<span class="arc-story-ring">' +
            '<img class="arc-story-avatar" src="' + post.photos[0].image + '" alt="" loading="lazy">' +
            '<span class="arc-verified-icon arc-verified-icon-ring" title="' + ARC_VERIFIED_LABEL + '">' + ARC_SEAL_SVG + '</span>' +
          '</span>' +
          '<span class="arc-story-handle">@' + escapeHTML(post.handle) + '</span>';
        bubble.addEventListener("click", function () { ArcStories.open(list, i); });
        grid.appendChild(bubble);
      });
    }

    function updateMoreBtn(cat) {
      // "Marcaram no story" sempre mostra todo mundo, sem botão "Ver mais".
      if (cat.key === "stories") { moreBtn.style.display = "none"; return; }
      moreBtn.style.display = (cat.posts.length > PAGE_LIMIT && !expanded) ? "" : "none";
    }

    function paintActive(cat) {
      currentCat = cat;
      expanded = false;
      if (cat.key === "stories") paintStoryTray(cat.posts, false);
      else paintGrid(cat.posts, true);
      updateMoreBtn(cat);
    }

    moreBtn.addEventListener("click", function () {
      expanded = true;
      paintGrid(currentCat.posts, false);
      moreBtn.style.display = "none";
    });

    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = categories.filter(function (c) { return c.key === btn.getAttribute("data-key"); })[0];
        paintActive(cat);
      });
    });

    paintActive(categories[0]);
  }

  /* ---- Encontre / Escolha seu tamanho: barrinha arrastável + clicável,
     grade de fotos por tamanho, alternância Padrão/Baby Look, e link
     pra GUIA DE MEDIDAS (abre a imagem no ArcImageModal). ---- */
  /* ============================================================
     PÁGINA DE DETALHES DO PRODUTO (Ajuste / Coleção, Avaliações,
     Tamanho e ajuste, Descrição, Detalhes, Cuidados) — acordeão
     que abre/fecha, mobile e desktop.
     ============================================================ */
  function renderArcanjuProductInfo(root, config) {
    injectStyles();

    var fitLabel = config.fitLabel || "Ajuste";
    var fitValue = config.fitValue || "Padrão";
    var collectionLabel = config.collectionLabel || "Coleção";
    var collectionValue = config.collectionValue || "";

    var html = '<div class="arc-pdp">' +
      '<div class="arc-pdp-top">' +
        '<div class="arc-pdp-top-item">' +
          '<span class="arc-pdp-top-icon">' + ARC_ICON_SHIRT + '</span>' +
          '<span class="arc-pdp-top-text"><span class="arc-pdp-top-label">' + escapeHTML(fitLabel) + '</span><strong class="arc-pdp-top-value">' + escapeHTML(fitValue) + '</strong></span>' +
        '</div>' +
        (collectionValue ?
        '<div class="arc-pdp-top-item">' +
          '<span class="arc-pdp-top-icon">' + ARC_ICON_HALO + '</span>' +
          '<span class="arc-pdp-top-text"><span class="arc-pdp-top-label">' + escapeHTML(collectionLabel) + '</span><strong class="arc-pdp-top-value">' + escapeHTML(collectionValue) + '</strong></span>' +
        '</div>' : '') +
      '</div>' +
      '<div class="arc-accordion">';

    if (config.reviews) {
      html += '<div class="arc-accordion-item" data-key="reviews">' +
        '<button type="button" class="arc-accordion-trigger">' +
          '<span class="arc-accordion-title">Avaliações (' + (config.reviews.count || config.reviews.items.length) + ')</span>' +
          '<span class="arc-accordion-right"><span class="arc-mini-stars">' + starsHTML(config.reviews.average) + '</span>' + ARC_ICON_CHEVRON + '</span>' +
        '</button>' +
        '<div class="arc-accordion-panel-wrap"><div class="arc-accordion-panel arc-reviews-panel"></div></div>' +
      '</div>';
    }
    if (config.fitAndSize) {
      html += '<div class="arc-accordion-item" data-key="fit">' +
        '<button type="button" class="arc-accordion-trigger">' +
          '<span class="arc-accordion-title">Tamanho e ajuste</span>' +
          '<span class="arc-accordion-right">' + ARC_ICON_CHEVRON + '</span>' +
        '</button>' +
        '<div class="arc-accordion-panel-wrap"><div class="arc-accordion-panel">' +
          '<div class="arc-fit-block">' +
            (config.fitAndSize.image ? '<img class="arc-fit-img" src="' + config.fitAndSize.image + '" alt="Detalhe do tecido">' : '') +
            '<div class="arc-fit-text">' +
              '<p><strong>' + escapeHTML(config.fitAndSize.title || "Modelagem padrão:") + '</strong> ' + escapeHTML(config.fitAndSize.text || "") + '</p>' +
              (config.sizeGuideImage ? '<button type="button" class="arc-size-guide-link arc-fit-guide-link">Guia de medidas</button>' : '') +
            '</div>' +
          '</div>' +
        '</div></div>' +
      '</div>';
    }
    if (config.description) {
      html += '<div class="arc-accordion-item" data-key="description">' +
        '<button type="button" class="arc-accordion-trigger">' +
          '<span class="arc-accordion-title">Descrição</span>' +
          '<span class="arc-accordion-right">' + ARC_ICON_CHEVRON + '</span>' +
        '</button>' +
        '<div class="arc-accordion-panel-wrap"><div class="arc-accordion-panel">' +
          '<p class="arc-description-text">' + config.description + '</p>' +
        '</div></div>' +
      '</div>';
    }
    if (config.details && config.details.length) {
      html += '<div class="arc-accordion-item" data-key="details">' +
        '<button type="button" class="arc-accordion-trigger">' +
          '<span class="arc-accordion-title">Detalhes</span>' +
          '<span class="arc-accordion-right">' + ARC_ICON_CHEVRON + '</span>' +
        '</button>' +
        '<div class="arc-accordion-panel-wrap"><div class="arc-accordion-panel">' +
          '<ul class="arc-details-list">' + config.details.map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
        '</div></div>' +
      '</div>';
    }
    if (config.care) {
      html += '<div class="arc-accordion-item" data-key="care">' +
        '<button type="button" class="arc-accordion-trigger">' +
          '<span class="arc-accordion-title">Cuidados</span>' +
          '<span class="arc-accordion-right">' + ARC_ICON_CHEVRON + '</span>' +
        '</button>' +
        '<div class="arc-accordion-panel-wrap"><div class="arc-accordion-panel">' +
          '<div class="arc-care-block">' +
            (config.care.general && config.care.general.length ?
            '<div><h4 class="arc-care-heading">Cuidados gerais</h4><ul class="arc-care-wash-list">' +
              config.care.general.map(function (t) { return '<li>' + ARC_ICON_CHECK + '<span>' + t + '</span></li>'; }).join('') +
            '</ul></div>' : '') +
            (config.care.avoid && config.care.avoid.length ?
            '<div><h4 class="arc-care-heading">Evite</h4><ul class="arc-care-wash-list">' +
              config.care.avoid.map(function (t) { return '<li>' + ARC_ICON_AVOID + '<span>' + t + '</span></li>'; }).join('') +
            '</ul></div>' : '') +
            (config.care.wash && config.care.wash.length ?
            '<div><h4 class="arc-care-heading">Instruções de lavagem</h4><ul class="arc-care-wash-list">' +
              config.care.wash.map(function (w) { return '<li>' + (ARC_CARE_ICONS[w.icon] || '') + '<span>' + w.text + '</span></li>'; }).join('') +
            '</ul></div>' : '') +
            (config.care.additional && config.care.additional.length ?
            '<div><h4 class="arc-care-heading">Informação adicional</h4><ul class="arc-care-extra-list">' +
              config.care.additional.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
            '</ul></div>' : '') +
          '</div>' +
          (config.care.signature ?
          '<div class="arc-care-signature">' +
            '<p class="arc-care-message">' + config.care.signature.message + '</p>' +
            (config.care.signature.verse ? '<p class="arc-care-verse">' + config.care.signature.verse + '</p>' : '') +
          '</div>' : '') +
        '</div></div>' +
      '</div>';
    }
    html += '</div></div>';
    root.innerHTML = html;

    root.querySelectorAll(".arc-accordion-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.closest(".arc-accordion-item").classList.toggle("is-open");
      });
    });

    var guideBtn = root.querySelector(".arc-fit-guide-link");
    if (guideBtn) {
      guideBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        ArcImageModal.open(config.sizeGuideImage, "Guia de medidas");
      });
    }

    if (config.reviews) {
      var panel = root.querySelector(".arc-reviews-panel");
      var reviews = config.reviews;
      var activeFilter = null;
      var sortBy = "recent";

      panel.innerHTML =
        '<div class="arc-reviews-summary"><div class="arc-reviews-avg">' +
          '<span class="arc-reviews-avg-number">' + reviews.average.toFixed(1) + '</span>' +
          '<span class="arc-stars-lg">' + starsHTML(reviews.average) + '</span>' +
        '</div></div>' +
        '<div class="arc-reviews-controls">' +
          '<div class="arc-reviews-filters">' +
            [5, 4, 3, 2, 1].map(function (n) { return '<button type="button" class="arc-filter-chip" data-star="' + n + '">' + ARC_ICON_STAR_FILLED + ' ' + n + '</button>'; }).join('') +
          '</div>' +
          '<div class="arc-reviews-sort"><label>Ordenar por</label>' +
            '<select class="arc-sort-select">' +
              '<option value="recent">Mais recente</option>' +
              '<option value="highest">Maior nota</option>' +
              '<option value="lowest">Menor nota</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="arc-reviews-list"></div>';

      var list = panel.querySelector(".arc-reviews-list");
      var chips = panel.querySelectorAll(".arc-filter-chip");
      var sortSelect = panel.querySelector(".arc-sort-select");

      function paintReviews() {
        var items = reviews.items.slice();
        if (activeFilter) items = items.filter(function (r) { return Math.round(r.rating) === activeFilter; });
        if (sortBy === "highest") items.sort(function (a, b) { return b.rating - a.rating; });
        else if (sortBy === "lowest") items.sort(function (a, b) { return a.rating - b.rating; });
        else items.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        list.innerHTML = items.length ? items.map(function (r) {
          return '<div class="arc-review-card">' +
            '<div class="arc-review-stars">' + starsHTML(r.rating) + '</div>' +
            '<div class="arc-review-head"><strong>' + r.title + '</strong><span class="arc-review-date">' + formatDatePt(r.date) + '</span></div>' +
            '<div class="arc-review-meta"><span class="arc-review-author">' + r.author + '</span>' +
              (r.verified ? '<span class="arc-review-verified">' + ARC_SEAL_SVG + 'Comprador verificado</span>' : '') +
            '</div>' +
            '<p class="arc-review-body">' + r.body + '</p>' +
          '</div>';
        }).join('') : '<p class="arc-reviews-empty">Nenhuma avaliação com esse filtro ainda.</p>';
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var star = parseInt(chip.getAttribute("data-star"), 10);
          activeFilter = activeFilter === star ? null : star;
          chips.forEach(function (c) { c.classList.toggle("is-active", parseInt(c.getAttribute("data-star"), 10) === activeFilter); });
          paintReviews();
        });
      });
      sortSelect.addEventListener("change", function () { sortBy = sortSelect.value; paintReviews(); });

      paintReviews();
    }
  }

  function renderArcanjuSizeGuide(root, config) {
    var fits = config.fits;
    if (!fits || !fits.regular || !fits.regular.length) return;
    var hasBabyLook = fits.babylook && fits.babylook.length;

    injectStyles();

    function withGuideLink(text) {
      return text.replace("GUIA DE MEDIDAS", '<button type="button" class="arc-size-guide-link">GUIA DE MEDIDAS</button>');
    }

    root.innerHTML =
      '<section class="arc-size-section">' +
        '<div class="arc-size-head">' +
          '<h2 class="arc-size-title">' + escapeHTML(config.title) + '</h2>' +
          '<p class="arc-size-intro">' + withGuideLink(escapeHTML(config.introText)) + '</p>' +
        '</div>' +
        (hasBabyLook ?
          '<div class="arc-tabs arc-size-fit-tabs" role="tablist">' +
            '<button type="button" class="arc-tab is-active" data-fit="regular">Padrão</button>' +
            '<button type="button" class="arc-tab" data-fit="babylook">Baby Look</button>' +
          '</div>' : '') +
        '<div class="arc-size-slider-wrap">' +
          '<div class="arc-size-track" role="slider" tabindex="0" aria-label="Selecionar tamanho" aria-valuemin="0">' +
            '<div class="arc-size-track-fill"></div>' +
            '<div class="arc-size-track-ticks"></div>' +
            '<div class="arc-size-track-thumb"></div>' +
          '</div>' +
          '<div class="arc-size-labels"></div>' +
        '</div>' +
        '<div class="arc-size-grid"></div>' +
        '<p class="arc-size-below">' + withGuideLink(escapeHTML(config.belowText)) + '</p>' +
        '<button type="button" class="arc-size-more">' + escapeHTML(config.moreButtonText || "VER MAIS FOTOS") + '</button>' +
      '</section>';

    var track = root.querySelector(".arc-size-track");
    var trackFill = root.querySelector(".arc-size-track-fill");
    var trackTicks = root.querySelector(".arc-size-track-ticks");
    var thumb = root.querySelector(".arc-size-track-thumb");
    var labelsWrap = root.querySelector(".arc-size-labels");
    var grid = root.querySelector(".arc-size-grid");
    var fitTabs = root.querySelectorAll(".arc-size-fit-tabs .arc-tab");
    var currentFit = "regular";
    var index = 0;

    function currentSizes() { return fits[currentFit]; }

    function buildTicksAndLabels() {
      var sizes = currentSizes();
      trackTicks.innerHTML = "";
      labelsWrap.innerHTML = "";
      sizes.forEach(function (s, i) {
        var tick = document.createElement("span");
        tick.className = "arc-size-tick";
        trackTicks.appendChild(tick);

        var b = document.createElement("button");
        b.type = "button";
        b.textContent = s.label;
        b.addEventListener("click", function () { setIndex(i); });
        labelsWrap.appendChild(b);
      });
      track.setAttribute("aria-valuemax", sizes.length - 1);
    }

    function paintGrid(idx) {
      var size = currentSizes()[idx];
      var photos = size.photos.slice(0, 4);
      grid.innerHTML = "";
      photos.forEach(function (p) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "arc-size-card";
        var stats = [p.age ? (p.age + " anos") : null, p.height || null, p.weight || null].filter(Boolean).join(" · ");
        card.innerHTML =
          '<img src="' + p.image + '" alt="Cliente vestindo tamanho ' + escapeHTML(size.label) + '" loading="lazy">' +
          (stats ? '<span class="arc-badge arc-badge-stat">' + escapeHTML(stats) + '</span>' : '');
        card.addEventListener("click", function () { ArcImageModal.open(p.image, "Cliente vestindo tamanho " + size.label); });
        grid.appendChild(card);
      });
    }

    function updateLabelsActive(idx) {
      labelsWrap.querySelectorAll("button").forEach(function (b, i) { b.classList.toggle("is-active", i === idx); });
    }

    function setIndex(i, skipPaint) {
      var sizes = currentSizes();
      index = Math.max(0, Math.min(sizes.length - 1, i));
      var pct = sizes.length > 1 ? (index / (sizes.length - 1)) * 100 : 0;
      trackFill.style.width = pct + "%";
      thumb.style.left = pct + "%";
      track.setAttribute("aria-valuenow", index);
      updateLabelsActive(index);
      if (!skipPaint) paintGrid(index);
    }

    function posToIndex(clientX) {
      var rect = track.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(pct * (currentSizes().length - 1));
    }

    var dragging = false;
    track.addEventListener("pointerdown", function (e) {
      dragging = true;
      if (track.setPointerCapture) { try { track.setPointerCapture(e.pointerId); } catch (err) {} }
      setIndex(posToIndex(e.clientX));
    });
    track.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      setIndex(posToIndex(e.clientX));
    });
    track.addEventListener("pointerup", function () { dragging = false; });
    track.addEventListener("pointercancel", function () { dragging = false; });
    track.addEventListener("click", function (e) { setIndex(posToIndex(e.clientX)); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { setIndex(index + 1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { setIndex(index - 1); e.preventDefault(); }
    });

    buildTicksAndLabels();
    setIndex(0);

    fitTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var fit = tab.getAttribute("data-fit");
        if (fit === currentFit) return;
        currentFit = fit;
        fitTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        buildTicksAndLabels();
        setIndex(0);
      });
    });

    root.querySelectorAll(".arc-size-guide-link").forEach(function (btn) {
      btn.addEventListener("click", function () { ArcImageModal.open(config.sizeGuideImage, "Guia de medidas"); });
    });

    root.querySelector(".arc-size-more").addEventListener("click", function () {
      var target = document.querySelector(config.scrollTarget || ".arcanju-community");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---- Vídeos de produção estilo Stories: carrossel de cards retrato
     com setas de navegação; ao clicar, abre o mesmo player vertical do
     ArcStories, só que sem @ de cliente. ---- */
  function renderArcanjuProductionStories(root, config) {
    var groups = config.groups;
    if (!groups || !groups.length) return;

    injectStyles();

    root.innerHTML =
      '<section class="arc-section">' +
        '<header class="arc-head">' +
          '<h2 class="arc-title">' + escapeHTML(config.title) + '</h2>' +
          '<p class="arc-text">' + escapeHTML(config.text) + '</p>' +
        '</header>' +
        '<div class="arc-video-carousel">' +
          '<button type="button" class="arc-video-nav arc-video-prev" aria-label="Vídeos anteriores">&lsaquo;</button>' +
          '<div class="arc-video-track" role="list"></div>' +
          '<button type="button" class="arc-video-nav arc-video-next" aria-label="Próximos vídeos">&rsaquo;</button>' +
        '</div>' +
      '</section>';

    var track = root.querySelector(".arc-video-track");
    groups.forEach(function (group, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "arc-video-card";
      card.setAttribute("role", "listitem");
      card.setAttribute("aria-label", "Ver vídeos: " + group.label);
      card.innerHTML =
        '<span class="arc-video-card-media">' +
          '<img src="' + (group.avatar || group.photos[0].image) + '" alt="" loading="lazy">' +
          '<span class="arc-video-play"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
        '</span>' +
        '<span class="arc-video-card-label">' + escapeHTML(group.label) + '</span>';
      card.addEventListener("click", function () { ArcStories.open(groups, i); });
      track.appendChild(card);
    });

    var prevBtn = root.querySelector(".arc-video-prev");
    var nextBtn = root.querySelector(".arc-video-next");
    function scrollByCards(dir) {
      var card = track.querySelector(".arc-video-card");
      var step = card ? (card.getBoundingClientRect().width + 14) * 2 : 300;
      track.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    prevBtn.addEventListener("click", function () { scrollByCards(-1); });
    nextBtn.addEventListener("click", function () { scrollByCards(1); });
  }

  /* ---- Stories viewer: bolinhas de destaque + player vertical com
     barrinhas de progresso, avanço automático, toque nos lados pra
     navegar e segurar pra pausar — igual Stories do Instagram. --- */
  var ArcStories = (function () {
    var DURATION = 5000; // ms por foto (imagens)
    var overlay, barsWrap, headerAvatar, headerHandle, headerBadge, headerBadgeText,
        mediaImg, mediaVideo, footerEl, footerThumb, footerName, footerMeta, footerCta;
    var posts = [], personIndex = 0, photoIndex = 0;
    var activeFill = null;

    function ensureBuilt() {
      if (overlay) return;
      overlay = document.createElement("div");
      overlay.className = "arc-story-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML =
        '<div class="arc-story-frame">' +
          '<div class="arc-story-bars"></div>' +
          '<div class="arc-story-header">' +
            '<img class="arc-story-header-avatar" src="" alt="">' +
            '<a class="arc-story-header-handle" href="#" target="_blank" rel="noopener"></a>' +
            verifiedBadge("arc-verified-badge-header") +
            '<button class="arc-story-close" aria-label="Fechar">&times;</button>' +
          '</div>' +
          '<div class="arc-story-media">' +
            '<img src="" alt="">' +
            '<video class="arc-story-video" muted playsinline></video>' +
          '</div>' +
          '<div class="arc-story-taps">' +
            '<div class="arc-story-tap arc-story-tap-prev" aria-hidden="true"></div>' +
            '<div class="arc-story-tap arc-story-tap-next" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="arc-story-footer">' +
            '<img class="arc-story-footer-thumb" src="" alt="">' +
            '<div class="arc-story-footer-info">' +
              '<span class="arc-story-footer-name"></span>' +
              '<span class="arc-story-footer-meta"></span>' +
            '</div>' +
            '<a class="arc-story-footer-cta" href="#" target="_blank" rel="noopener">Ver produto</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      barsWrap = overlay.querySelector(".arc-story-bars");
      headerAvatar = overlay.querySelector(".arc-story-header-avatar");
      headerHandle = overlay.querySelector(".arc-story-header-handle");
      headerBadge = overlay.querySelector(".arc-verified-badge-header");
      headerBadgeText = headerBadge.querySelector("span");
      mediaImg = overlay.querySelector(".arc-story-media img");
      mediaVideo = overlay.querySelector(".arc-story-video");
      footerEl = overlay.querySelector(".arc-story-footer");
      footerThumb = overlay.querySelector(".arc-story-footer-thumb");
      footerName = overlay.querySelector(".arc-story-footer-name");
      footerMeta = overlay.querySelector(".arc-story-footer-meta");
      footerCta = overlay.querySelector(".arc-story-footer-cta");

      overlay.querySelector(".arc-story-close").addEventListener("click", close);
      overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
      document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") stepPhoto(-1);
        if (e.key === "ArrowRight") stepPhoto(1);
      });

      var prevTap = overlay.querySelector(".arc-story-tap-prev");
      var nextTap = overlay.querySelector(".arc-story-tap-next");
      [[prevTap, -1], [nextTap, 1]].forEach(function (pair) {
        var zone = pair[0], dir = pair[1];
        var holdStart = 0, holding = false;
        zone.addEventListener("pointerdown", function () { holding = true; holdStart = Date.now(); pauseFill(); });
        var release = function () {
          if (!holding) return;
          holding = false;
          resumeFill();
          if (Date.now() - holdStart < 300) stepPhoto(dir);
        };
        zone.addEventListener("pointerup", release);
        zone.addEventListener("pointerleave", function () { if (holding) { holding = false; resumeFill(); } });
      });
    }

    function open(allPosts, pIndex) {
      ensureBuilt();
      posts = allPosts;
      personIndex = pIndex;
      photoIndex = 0;
      renderBars();
      paint();
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      activeFill = null;
      mediaVideo.pause();
    }

    function renderBars() {
      var total = posts[personIndex].photos.length;
      barsWrap.innerHTML = "";
      for (var i = 0; i < total; i++) {
        var bar = document.createElement("div");
        bar.className = "arc-story-bar";
        bar.innerHTML = '<span class="arc-story-bar-fill"></span>';
        barsWrap.appendChild(bar);
      }
    }

    function paint() {
      var post = posts[personIndex];
      var photo = post.photos[photoIndex];
      var displayName = post.label || ("@" + post.handle);
      var linkUrl = post.linkUrl !== undefined ? post.linkUrl : (post.instagram || (post.handle ? ("https://instagram.com/" + post.handle) : null));

      mediaVideo.pause();
      mediaVideo.onended = null;
      if (photo.video) {
        mediaImg.style.display = "none";
        mediaVideo.style.display = "block";
        mediaVideo.src = photo.video;
        mediaVideo.poster = photo.image || "";
        mediaVideo.currentTime = 0;
        mediaVideo.onended = function () { stepPhoto(1); };
        mediaVideo.play().catch(function () {});
      } else {
        mediaVideo.style.display = "none";
        mediaImg.style.display = "block";
        mediaImg.src = photo.image;
        mediaImg.alt = "Story de " + displayName;
      }

      headerAvatar.src = post.avatar || post.photos[0].image;
      headerHandle.textContent = displayName;
      if (linkUrl) { headerHandle.href = linkUrl; headerHandle.classList.remove("is-static"); }
      else { headerHandle.removeAttribute("href"); headerHandle.classList.add("is-static"); }

      var badgeLabel = photo.badgeText || post.badgeText;
      if (badgeLabel || post.handle) {
        headerBadge.style.display = "";
        headerBadgeText.textContent = badgeLabel || ARC_VERIFIED_LABEL;
      } else {
        headerBadge.style.display = "none";
      }

      if (photo.product) {
        footerEl.style.display = "flex";
        footerThumb.style.display = "block";
        footerThumb.src = photo.product.image;
        footerName.textContent = photo.product.name;
        footerMeta.textContent = photo.product.size
          ? (photo.product.price + " · Tamanho " + photo.product.size)
          : photo.product.price;
        footerCta.style.display = "";
        footerCta.href = photo.product.url;
      } else if (photo.caption) {
        footerEl.style.display = "flex";
        footerThumb.style.display = "none";
        footerName.textContent = photo.caption;
        footerMeta.textContent = "";
        footerCta.style.display = "none";
      } else {
        footerEl.style.display = "none";
      }

      updateBars();
    }

    function updateBars() {
      var photo = posts[personIndex].photos[photoIndex];
      var dur = photo.video ? ((photo.duration || 15) * 1000) : DURATION;
      var fills = barsWrap.querySelectorAll(".arc-story-bar-fill");
      fills.forEach(function (fill, i) {
        fill.classList.remove("is-active");
        fill.removeEventListener("animationend", onFillDone);
        if (i < photoIndex) {
          fill.style.width = "100%";
        } else if (i === photoIndex) {
          fill.style.width = "0%";
          fill.style.setProperty("--dur", dur + "ms");
          void fill.offsetWidth; // força reflow pra reiniciar a animação
          fill.classList.add("is-active");
          if (!photo.video) fill.addEventListener("animationend", onFillDone); // vídeo avança pelo evento "ended" dele mesmo
          activeFill = fill;
        } else {
          fill.style.width = "0%";
        }
      });
    }
    function onFillDone() { stepPhoto(1); }

    function pauseFill() {
      if (activeFill) activeFill.style.animationPlayState = "paused";
      if (mediaVideo.style.display !== "none") mediaVideo.pause();
    }
    function resumeFill() {
      if (activeFill) activeFill.style.animationPlayState = "running";
      if (mediaVideo.style.display !== "none") mediaVideo.play().catch(function () {});
    }

    function stepPhoto(dir) {
      var total = posts[personIndex].photos.length;
      if (dir > 0) {
        if (photoIndex < total - 1) { photoIndex++; paint(); }
        else { nextPerson(); }
      } else {
        if (photoIndex > 0) { photoIndex--; paint(); }
        else { prevPerson(); }
      }
    }
    function nextPerson() {
      if (personIndex < posts.length - 1) {
        personIndex++; photoIndex = 0; renderBars(); paint();
      } else {
        close();
      }
    }
    function prevPerson() {
      if (personIndex > 0) {
        personIndex--; photoIndex = posts[personIndex].photos.length - 1; renderBars(); paint();
      } else {
        photoIndex = 0; paint();
      }
    }

    return { open: open };
  })();

  /* ---- Modal simples pra imagem única (usado pela GUIA DE MEDIDAS) ---- */
  var ArcImageModal = (function () {
    var overlay, img;
    function ensureBuilt() {
      if (overlay) return;
      overlay = document.createElement("div");
      overlay.className = "arc-image-modal";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML =
        '<button class="arc-close arc-image-modal-close" aria-label="Fechar">&times;</button>' +
        '<img class="arc-image-modal-img" src="" alt="">';
      document.body.appendChild(overlay);
      img = overlay.querySelector(".arc-image-modal-img");
      overlay.querySelector(".arc-image-modal-close").addEventListener("click", close);
      overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
      document.addEventListener("keydown", function (e) {
        if (overlay.classList.contains("is-open") && e.key === "Escape") close();
      });
    }
    function open(url, alt) {
      if (!url) return;
      ensureBuilt();
      img.src = url;
      img.alt = alt || "Guia de medidas";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      if (!overlay) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    return { open: open };
  })();

  /* ---- Lightbox: singleton, anexado direto no <body> para não herdar
     nenhum "transform" de containers pais (é isso que quebra o
     position:fixed em temas/previews que aplicam zoom/escala em telas
     menores). Compartilhado por todas as instâncias do widget na página. --- */
  var ArcLightbox = (function () {
    var el, stageImg, dotsWrap, pHandle, pThumb, pName, pMeta, pCta;
    var posts = [], postIndex = 0, photoIndex = 0;
    var touchStartX = null;

    function ensureBuilt() {
      if (el) return;
      el = document.createElement("div");
      el.className = "arc-lightbox";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML =
        '<button class="arc-close" aria-label="Fechar">&times;</button>' +
        '<button class="arc-nav arc-prev" aria-label="Pessoa anterior">&lsaquo;</button>' +
        '<button class="arc-nav arc-next" aria-label="Próxima pessoa">&rsaquo;</button>' +
        '<div class="arc-stage">' +
          '<div class="arc-media">' +
            '<img class="arc-stage-img" src="" alt="">' +
            '<div class="arc-photo-dots"></div>' +
          '</div>' +
          '<div class="arc-product-card">' +
            '<div class="arc-product-handle-row">' +
              '<a class="arc-product-handle" href="#" target="_blank" rel="noopener"></a>' +
              verifiedBadge() +
            '</div>' +
            '<div class="arc-product-body">' +
              '<img class="arc-product-thumb" src="" alt="">' +
              '<div class="arc-product-info">' +
                '<span class="arc-product-name"></span>' +
                '<span class="arc-product-meta"></span>' +
              '</div>' +
              '<a class="arc-product-cta" href="#" target="_blank" rel="noopener">Ver produto</a>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      stageImg = el.querySelector(".arc-stage-img");
      dotsWrap = el.querySelector(".arc-photo-dots");
      pHandle = el.querySelector(".arc-product-handle");
      pThumb = el.querySelector(".arc-product-thumb");
      pName = el.querySelector(".arc-product-name");
      pMeta = el.querySelector(".arc-product-meta");
      pCta = el.querySelector(".arc-product-cta");

      el.querySelector(".arc-close").addEventListener("click", close);
      el.querySelector(".arc-prev").addEventListener("click", function () { stepPost(-1); });
      el.querySelector(".arc-next").addEventListener("click", function () { stepPost(1); });
      el.addEventListener("click", function (e) { if (e.target === el) close(); });
      document.addEventListener("keydown", function (e) {
        if (!el.classList.contains("is-open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") stepPost(-1);
        if (e.key === "ArrowRight") stepPost(1);
      });

      var media = el.querySelector(".arc-media");
      media.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
      media.addEventListener("touchend", function (e) {
        if (touchStartX === null) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) stepPhoto(dx > 0 ? -1 : 1);
        touchStartX = null;
      }, { passive: true });
    }

    function open(allPosts, pIndex, phIndex) {
      ensureBuilt();
      posts = allPosts;
      postIndex = pIndex;
      photoIndex = phIndex || 0;
      paint();
      el.classList.add("is-open");
      el.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    function stepPost(dir) {
      postIndex = (postIndex + dir + posts.length) % posts.length;
      photoIndex = 0;
      paint();
    }
    function stepPhoto(dir) {
      var total = posts[postIndex].photos.length;
      if (total <= 1) return;
      photoIndex = (photoIndex + dir + total) % total;
      paint();
    }
    function paint() {
      var post = posts[postIndex];
      var photo = post.photos[photoIndex];
      stageImg.src = photo.image;
      stageImg.alt = "Look de @" + post.handle;
      pHandle.textContent = "@" + post.handle;
      pHandle.href = post.instagram || ("https://instagram.com/" + post.handle);
      pThumb.src = photo.product.image;
      pName.textContent = photo.product.name;
      pMeta.textContent = photo.product.price
        ? (photo.product.size ? (photo.product.price + " · Tamanho " + photo.product.size) : photo.product.price)
        : (photo.product.size ? ("Tamanho " + photo.product.size) : "");
      if (photo.product.url) {
        pCta.style.display = "";
        pCta.href = photo.product.url;
      } else {
        pCta.style.display = "none";
      }

      dotsWrap.innerHTML = "";
      if (post.photos.length > 1) {
        post.photos.forEach(function (_, i) {
          var dot = document.createElement("button");
          dot.className = "arc-dot" + (i === photoIndex ? " is-active" : "");
          dot.setAttribute("aria-label", "Foto " + (i + 1) + " de " + post.photos.length);
          dot.addEventListener("click", function () { photoIndex = i; paint(); });
          dotsWrap.appendChild(dot);
        });
      }
    }

    return { open: open };
  })();

  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function injectStyles() {
    if (document.getElementById("arc-styles")) return;

    // Fontes (pode trocar por outras do Google Fonts se preferir)
    var link1 = document.createElement("link");
    link1.rel = "stylesheet";
    link1.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link1);

    var style = document.createElement("style");
    style.id = "arc-styles";
    style.textContent = [
      ":root{",
      "  --arc-bg:#ffffff;--arc-surface:#f7f3f1;--arc-text:#1c1a19;--arc-text-muted:#746c68;",
      "  --arc-accent:#5a332e;--arc-accent-soft:rgba(90,51,46,0.08);",
      "  --arc-success:#1f9d6c;--arc-success-soft:rgba(31,157,108,0.12);",
      "  --arc-border:#e7e1dd;--arc-cta-bg:#141414;--arc-cta-text:#ffffff;--arc-radius:14px;",
      "  --arc-font-display:'Poppins',sans-serif;--arc-font-body:'Inter',sans-serif;}",
      ".arcanju-community,.arcanju-production{",
      "  background:var(--arc-bg);color:var(--arc-text);font-family:var(--arc-font-body);",
      "  padding:64px 20px;box-sizing:border-box;}",
      ".arcanju-community *,.arcanju-production *{box-sizing:border-box;}",
      ".arc-lightbox,.arc-lightbox *,.arc-story-overlay,.arc-story-overlay *,.arc-image-modal,.arc-image-modal *{box-sizing:border-box;}",
      ".arc-section{max-width:1160px;margin:0 auto;}",

      ".arcanju-product-info{background:var(--arc-bg);color:var(--arc-text);font-family:var(--arc-font-body);padding:48px 20px;box-sizing:border-box;}",
      ".arc-pdp{max-width:1160px;margin:0 auto;}",
      ".arc-pdp *{box-sizing:border-box;}",
      ".arc-pdp-top{display:flex;flex-wrap:wrap;gap:40px;padding-bottom:24px;border-bottom:1px solid var(--arc-border);margin-bottom:4px;}",
      ".arc-pdp-top-item{display:flex;align-items:center;gap:12px;}",
      ".arc-pdp-top-icon{color:var(--arc-accent);flex-shrink:0;}",
      ".arc-pdp-top-text{display:flex;flex-direction:column;}",
      ".arc-pdp-top-label{font-size:12px;color:var(--arc-text-muted);text-transform:uppercase;letter-spacing:.04em;}",
      ".arc-pdp-top-value{font-size:15px;font-weight:800;letter-spacing:.01em;}",
      ".arc-accordion-item{border-bottom:1px solid var(--arc-border);}",
      ".arc-accordion-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;background:none;border:none;padding:20px 4px;cursor:pointer;font-family:var(--arc-font-body);color:var(--arc-text);text-align:left;}",
      ".arc-accordion-title{font-size:15px;font-weight:700;}",
      ".arc-accordion-right{display:flex;align-items:center;gap:10px;color:var(--arc-text-muted);}",
      ".arc-mini-stars{display:flex;gap:1px;color:var(--arc-border);}",
      ".arc-mini-stars .is-filled{color:var(--arc-accent);}",
      ".arc-accordion-chevron{transition:transform .25s ease;flex-shrink:0;}",
      ".arc-accordion-item.is-open .arc-accordion-chevron{transform:rotate(180deg);}",
      ".arc-accordion-panel-wrap{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease;}",
      ".arc-accordion-item.is-open .arc-accordion-panel-wrap{grid-template-rows:1fr;}",
      ".arc-accordion-panel{overflow:hidden;min-height:0;}",
      ".arc-accordion-panel > *:first-child{margin-top:0;}",
      ".arc-accordion-panel > *:last-child{padding-bottom:24px;}",
      ".arc-fit-block{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start;}",
      ".arc-fit-img{width:220px;height:220px;object-fit:cover;border-radius:var(--arc-radius);flex-shrink:0;background:var(--arc-surface);}",
      ".arc-fit-text{flex:1;min-width:220px;font-size:14px;line-height:1.6;color:var(--arc-text-muted);}",
      ".arc-fit-text strong{color:var(--arc-text);}",
      ".arc-fit-guide-link{margin-top:10px;display:inline-block;}",
      ".arc-description-text{font-size:14px;line-height:1.7;color:var(--arc-text-muted);max-width:760px;white-space:pre-line;}",
      ".arc-details-list{columns:2;column-gap:40px;list-style:none;margin:0;padding:0;}",
      ".arc-details-list li{font-size:14px;color:var(--arc-text-muted);line-height:1.8;break-inside:avoid;position:relative;padding-left:14px;}",
      ".arc-details-list li::before{content:'•';position:absolute;left:0;color:var(--arc-accent);}",
      ".arc-care-block{display:grid;grid-template-columns:1fr 1fr;gap:32px;}",
      ".arc-care-heading{font-family:var(--arc-font-display);font-weight:800;font-size:15px;letter-spacing:.02em;margin:0 0 14px;}",
      ".arc-care-wash-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;}",
      ".arc-care-wash-list li{display:flex;align-items:center;gap:12px;font-size:13px;color:var(--arc-text-muted);}",
      ".arc-care-wash-list svg{color:var(--arc-accent);flex-shrink:0;}",
      ".arc-care-extra-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}",
      ".arc-care-extra-list li{font-size:13px;color:var(--arc-text-muted);position:relative;padding-left:14px;}",
      ".arc-care-extra-list li::before{content:'•';position:absolute;left:0;color:var(--arc-accent);}",
      ".arc-care-signature{margin-top:28px;padding-top:22px;border-top:1px dashed var(--arc-border);text-align:center;}",
      ".arc-care-message{font-size:13.5px;font-weight:600;color:var(--arc-text);line-height:1.6;margin:0 0 8px;}",
      ".arc-care-verse{font-size:12.5px;font-style:italic;color:var(--arc-text-muted);line-height:1.6;margin:0;max-width:460px;margin-left:auto;margin-right:auto;}",
      ".arc-reviews-summary{display:flex;align-items:center;gap:14px;margin-bottom:22px;}",
      ".arc-reviews-avg{display:flex;align-items:baseline;gap:10px;}",
      ".arc-reviews-avg-number{font-family:var(--arc-font-display);font-weight:800;font-size:34px;line-height:1;}",
      ".arc-stars-lg{display:flex;gap:2px;color:var(--arc-border);}",
      ".arc-stars-lg .is-filled{color:var(--arc-accent);}",
      ".arc-reviews-controls{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid var(--arc-border);}",
      ".arc-reviews-filters{display:flex;gap:8px;flex-wrap:wrap;}",
      ".arc-filter-chip{display:inline-flex;align-items:center;gap:5px;background:none;border:1px solid var(--arc-border);border-radius:8px;padding:7px 12px;font-size:12px;font-weight:600;color:var(--arc-text);cursor:pointer;transition:border-color .2s ease,background .2s ease;}",
      ".arc-filter-chip svg{color:var(--arc-accent);}",
      ".arc-filter-chip.is-active{border-color:var(--arc-accent);background:var(--arc-accent-soft);}",
      ".arc-reviews-sort{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--arc-text-muted);}",
      ".arc-sort-select{border:1px solid var(--arc-border);border-radius:8px;padding:7px 10px;font-size:12px;font-family:var(--arc-font-body);color:var(--arc-text);background:var(--arc-bg);}",
      ".arc-reviews-list{display:flex;flex-direction:column;gap:22px;}",
      ".arc-review-card{padding-bottom:20px;border-bottom:1px solid var(--arc-border);}",
      ".arc-review-card:last-child{border-bottom:none;padding-bottom:0;}",
      ".arc-review-stars{display:flex;gap:2px;color:var(--arc-border);margin-bottom:8px;}",
      ".arc-review-stars .is-filled{color:var(--arc-accent);}",
      ".arc-review-head{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;}",
      ".arc-review-head strong{font-size:14px;}",
      ".arc-review-date{font-size:12px;color:var(--arc-text-muted);white-space:nowrap;}",
      ".arc-review-meta{display:flex;align-items:center;gap:10px;margin-top:4px;flex-wrap:wrap;}",
      ".arc-review-author{font-size:12px;font-weight:700;color:var(--arc-text-muted);}",
      ".arc-review-verified{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--arc-success);}",
      ".arc-review-verified svg{width:12px;height:12px;}",
      ".arc-review-body{font-size:13.5px;line-height:1.6;color:var(--arc-text-muted);margin:10px 0 0;}",
      ".arc-reviews-empty{font-size:13px;color:var(--arc-text-muted);}",
      "@media (max-width:640px){",
      "  .arcanju-product-info{padding:36px 16px;}",
      "  .arc-pdp-top{gap:24px;}",
      "  .arc-details-list{columns:1;}",
      "  .arc-care-block{grid-template-columns:1fr;gap:24px;}",
      "  .arc-fit-img{width:100%;height:220px;}",
      "  .arc-reviews-controls{flex-direction:column;align-items:flex-start;}",
      "}",
      ".arc-head{max-width:640px;margin-bottom:36px;}",
      ".arc-title{font-family:var(--arc-font-display);font-weight:800;font-size:clamp(26px,4vw,40px);letter-spacing:-0.01em;margin:0 0 14px;line-height:1.15;display:inline-block;}",
      ".arc-title::after{content:'';display:block;width:56px;height:3px;background:var(--arc-accent);margin-top:14px;}",
      ".arc-text{color:var(--arc-text-muted);font-size:15px;line-height:1.6;margin:0;}",
      ".arc-mention{color:var(--arc-accent);text-decoration:none;font-weight:600;}",
      ".arc-mention:hover{text-decoration:underline;}",
      ".arc-trust{display:inline-flex;align-items:center;gap:9px;margin-top:16px;padding:10px 16px;border:1px solid var(--arc-border);border-left:3px solid var(--arc-success);border-radius:8px;background:var(--arc-surface);color:var(--arc-success);}",
      ".arc-trust-line{font-size:13px;color:var(--arc-text);font-weight:600;}",
      ".arc-verified-icon{display:inline-flex;align-items:center;justify-content:center;color:var(--arc-success);flex-shrink:0;cursor:default;}",
      ".arc-verified-icon-ring{position:absolute;right:-2px;bottom:-2px;background:var(--arc-bg);border-radius:50%;padding:1px;}",
      ".arc-verified-badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;color:var(--arc-success);border:1px solid var(--arc-success-soft);background:var(--arc-success-soft);padding:3px 9px;border-radius:999px;white-space:nowrap;}",
      ".arc-verified-badge svg{flex-shrink:0;}",
      ".arc-verified-badge-header{font-size:9.5px;padding:2px 7px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);}",
      ".arc-product-handle-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;}",
      ".arc-product-handle-row .arc-product-handle{margin-bottom:0;}",
      ".arc-tabs-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:22px;}",
      ".arc-tabs{display:inline-flex;gap:6px;background:var(--arc-surface);border:1px solid var(--arc-border);border-radius:999px;padding:4px;}",
      ".arc-tab{border:none;background:none;color:var(--arc-text-muted);font-family:var(--arc-font-body);font-size:13px;font-weight:600;padding:8px 16px;border-radius:999px;cursor:pointer;transition:background .2s ease,color .2s ease;white-space:nowrap;}",
      ".arc-tab.is-active{background:var(--arc-accent);color:#ffffff;}",
      ".arc-tab:not(.is-active):hover{color:var(--arc-text);}",
      ".arc-highlight-link{font-size:12px;font-weight:600;color:var(--arc-text-muted);text-decoration:none;white-space:nowrap;}",
      ".arc-highlight-link:hover{color:var(--arc-accent);}",
      ".arc-more-btn{display:block;margin:28px auto 0;background:var(--arc-cta-bg);border:1px solid var(--arc-cta-bg);color:var(--arc-cta-text);padding:12px 30px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:opacity .2s ease;}",
      ".arc-more-btn:hover{opacity:.85;}",
      ".arc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;}",
      ".arc-card{position:relative;border:1px solid var(--arc-border);border-radius:var(--arc-radius);overflow:hidden;background:var(--arc-surface);transition:transform .35s ease,border-color .35s ease;display:flex;flex-direction:column;}",
      ".arc-card:hover{transform:translateY(-3px);border-color:var(--arc-accent);}",
      ".arc-card-media{position:relative;aspect-ratio:4/5;}",
      ".arc-card-trigger{position:absolute;inset:0;width:100%;height:100%;border:none;padding:0;margin:0;background:none;cursor:pointer;display:block;}",
      ".arc-card-trigger:focus-visible{outline:2px solid var(--arc-accent);outline-offset:-2px;}",
      ".arc-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease;}",
      ".arc-card:hover .arc-card-img{transform:scale(1.05);}",
      ".arc-card-verified{padding:8px 10px;border-top:1px solid var(--arc-border);}",
      ".arc-card-verified .arc-verified-badge{width:100%;justify-content:center;box-sizing:border-box;white-space:normal;text-align:center;}",
      ".arc-badge{position:absolute;left:10px;bottom:10px;z-index:2;display:inline-flex;align-items:center;gap:6px;max-width:calc(100% - 20px);box-sizing:border-box;background:rgba(14,14,16,0.55);backdrop-filter:blur(6px);border:1px solid rgba(245,243,238,0.18);color:#ffffff;font-size:12px;font-weight:600;padding:6px 10px;border-radius:999px;text-decoration:none;transition:border-color .2s ease;}",
      ".arc-badge svg{flex-shrink:0;}",
      ".arc-badge span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}",
      ".arc-badge:hover{border-color:var(--arc-accent);}",
      ".arc-badge:focus-visible{outline:2px solid var(--arc-accent);outline-offset:2px;}",
      ".arc-multi{position:absolute;top:10px;right:10px;width:26px;height:26px;border-radius:8px;background:rgba(14,14,16,0.55);backdrop-filter:blur(6px);border:1px solid rgba(245,243,238,0.18);color:#ffffff;display:flex;align-items:center;justify-content:center;}",
      ".arc-lightbox{position:fixed;inset:0;background:rgba(6,6,7,0.94);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:99999;padding:24px;}",
      ".arc-lightbox.is-open{opacity:1;pointer-events:auto;}",
      ".arc-stage{position:relative;max-width:1000px;width:100%;max-height:88vh;display:flex;align-items:center;justify-content:center;}",
      ".arc-media{position:relative;display:flex;align-items:center;justify-content:center;max-width:100%;max-height:88vh;}",
      ".arc-stage-img{max-width:100%;max-height:88vh;border-radius:10px;object-fit:contain;display:block;}",
      ".arc-photo-dots{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;gap:6px;z-index:2;}",
      ".arc-dot{width:6px;height:6px;border-radius:50%;background:rgba(245,243,238,0.4);border:none;padding:0;cursor:pointer;transition:width .2s ease,background .2s ease;}",
      ".arc-dot.is-active{background:var(--arc-success);width:16px;border-radius:4px;}",
      ".arc-close{position:absolute;top:18px;right:18px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;font-size:22px;line-height:1;cursor:pointer;z-index:3;}",
      ".arc-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ffffff;font-size:26px;line-height:1;cursor:pointer;z-index:2;}",
      ".arc-prev{left:18px;}.arc-next{right:18px;}",
      ".arc-product-card{position:absolute;right:20px;bottom:20px;width:260px;background:var(--arc-surface);border:1px solid var(--arc-border);border-top:3px solid var(--arc-accent);border-radius:12px;padding:14px;box-shadow:0 12px 30px rgba(0,0,0,0.4);}",
      ".arc-product-handle{display:inline-block;font-size:12px;font-weight:600;color:var(--arc-accent);margin-bottom:10px;text-decoration:none;}",
      ".arc-product-handle:hover{text-decoration:underline;}",
      ".arc-product-body{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}",
      ".arc-product-thumb{width:44px;height:44px;border-radius:8px;object-fit:cover;flex-shrink:0;}",
      ".arc-product-info{display:flex;flex-direction:column;flex:1;min-width:0;}",
      ".arc-product-name{font-size:13px;font-weight:600;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".arc-product-meta{font-size:12px;color:var(--arc-text-muted);margin-top:2px;}",
      ".arc-product-cta{display:block;width:100%;text-align:center;margin-top:10px;padding:9px 0;background:var(--arc-cta-bg);color:var(--arc-cta-text);font-size:12px;font-weight:700;text-decoration:none;border-radius:8px;letter-spacing:0.02em;}",
      "@media (max-width:640px){",
      "  .arcanju-community,.arcanju-production{padding:44px 16px;}",
      "  .arc-grid{grid-template-columns:repeat(2,1fr);gap:10px;}",
      "  .arc-lightbox{padding:0 10px;align-items:flex-end;}",
      "  .arc-stage{max-height:100vh;height:100%;flex-direction:column;}",
      "  .arc-media{max-height:56vh;width:100%;}",
      "  .arc-stage-img{max-height:56vh;width:100%;object-fit:cover;border-radius:14px 14px 0 0;}",
      "  .arc-product-card{position:relative;right:auto;bottom:auto;width:100%;border-radius:0 0 14px 14px;margin-top:-16px;}",
      "  .arc-nav{display:none;}",
      "  .arc-close{top:14px;right:14px;background:rgba(0,0,0,0.5);}",
      "  .arc-story-overlay{padding:0 10px;}",
      "  .arc-story-frame{max-height:100vh;border-radius:16px;}",
      "  .arc-image-modal{padding:0 12px;}",
      "}",
      ".arc-story-tray{display:flex;gap:18px;overflow-x:auto;padding:2px 2px 10px;scrollbar-width:none;}",
      ".arc-story-tray::-webkit-scrollbar{display:none;}",
      ".arc-story-bubble{display:flex;flex-direction:column;align-items:center;gap:7px;background:none;border:none;cursor:pointer;flex-shrink:0;width:76px;}",
      ".arc-story-ring{position:relative;width:66px;height:66px;border-radius:50%;padding:3px;background:linear-gradient(135deg,var(--arc-success),#12603f);display:flex;align-items:center;justify-content:center;transition:transform .2s ease;}",
      ".arc-story-bubble:hover .arc-story-ring{transform:scale(1.05);}",
      ".arc-story-bubble:focus-visible .arc-story-ring{outline:2px solid var(--arc-accent);outline-offset:3px;}",
      ".arc-story-avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid var(--arc-bg);display:block;}",
      ".arc-story-handle{font-size:11px;color:var(--arc-text-muted);max-width:76px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",

      ".arc-video-carousel{position:relative;display:flex;align-items:center;gap:8px;}",
      ".arc-video-track{display:flex;gap:14px;overflow-x:auto;scroll-behavior:smooth;padding:2px 2px 6px;scrollbar-width:none;flex:1;}",
      ".arc-video-track::-webkit-scrollbar{display:none;}",
      ".arc-video-card{flex:0 0 auto;width:170px;background:none;border:none;padding:0;cursor:pointer;text-align:left;}",
      ".arc-video-card-media{position:relative;display:block;aspect-ratio:3/4;border-radius:var(--arc-radius);overflow:hidden;background:var(--arc-surface);border:1px solid var(--arc-border);transition:transform .3s ease,border-color .3s ease;}",
      ".arc-video-card:hover .arc-video-card-media{transform:translateY(-3px);border-color:var(--arc-accent);}",
      ".arc-video-card:focus-visible .arc-video-card-media{outline:2px solid var(--arc-accent);outline-offset:2px;}",
      ".arc-video-card-media img{width:100%;height:100%;object-fit:cover;display:block;}",
      ".arc-video-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.9);color:var(--arc-cta-bg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.25);}",
      ".arc-video-card-label{display:block;margin-top:8px;font-size:13px;font-weight:600;color:var(--arc-text);}",
      ".arc-video-nav{flex-shrink:0;width:36px;height:36px;border-radius:50%;background:var(--arc-bg);border:1px solid var(--arc-border);color:var(--arc-text);font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s ease;}",
      ".arc-video-nav:hover{border-color:var(--arc-accent);color:var(--arc-accent);}",
      "@media (max-width:640px){.arc-video-nav{display:none;}.arc-video-card{width:132px;}}",

      ".arc-story-overlay{position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s ease;z-index:100000;}",
      ".arc-story-overlay.is-open{opacity:1;pointer-events:auto;}",
      ".arc-story-frame{position:relative;width:100%;max-width:420px;height:100%;max-height:100vh;background:#0b0b0c;overflow:hidden;}",
      "@media (min-width:641px){.arc-story-frame{max-height:92vh;border-radius:18px;}}",
      ".arc-story-bars{position:absolute;top:10px;left:10px;right:10px;display:flex;gap:4px;z-index:3;}",
      ".arc-story-bar{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,0.3);overflow:hidden;}",
      ".arc-story-bar-fill{display:block;height:100%;width:0%;background:#fff;}",
      ".arc-story-bar-fill.is-active{animation:arcStoryFill var(--dur) linear forwards;}",
      "@keyframes arcStoryFill{from{width:0%}to{width:100%}}",
      ".arc-story-header{position:absolute;top:24px;left:10px;right:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;row-gap:6px;z-index:3;}",
      ".arc-story-header-avatar{width:26px;height:26px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.5);flex-shrink:0;}",
      ".arc-story-header-handle{color:#fff;font-size:13px;font-weight:600;text-decoration:none;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".arc-story-header-handle:hover{text-decoration:underline;}",
      ".arc-story-header-handle.is-static{cursor:default;}",
      ".arc-story-header-handle.is-static:hover{text-decoration:none;}",
      ".arc-story-close{margin-left:auto;background:none;border:none;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px;flex-shrink:0;}",
      ".arc-story-media{position:absolute;inset:0;}",
      ".arc-story-media img{width:100%;height:100%;object-fit:cover;display:block;}",
      ".arc-story-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;}",
      ".arc-story-taps{position:absolute;inset:0;display:flex;z-index:2;}",
      ".arc-story-tap{flex:1;}",
      ".arc-story-footer{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:16px;padding-top:48px;background:linear-gradient(to top, rgba(0,0,0,.78), transparent);display:flex;align-items:center;gap:10px;}",
      ".arc-story-footer-thumb{width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0;}",
      ".arc-story-footer-info{display:flex;flex-direction:column;flex:1;min-width:0;color:#fff;}",
      ".arc-story-footer-name{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".arc-story-footer-meta{font-size:11px;color:rgba(255,255,255,.72);margin-top:1px;}",
      ".arc-story-footer-cta{background:var(--arc-cta-bg);color:var(--arc-cta-text);font-size:11px;font-weight:700;padding:9px 14px;border-radius:8px;text-decoration:none;white-space:nowrap;}",

      ".arc-image-modal{position:fixed;inset:0;background:rgba(6,6,7,0.94);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .2s ease;z-index:100000;padding:24px;}",
      ".arc-image-modal.is-open{opacity:1;pointer-events:auto;}",
      ".arc-image-modal-img{max-width:100%;max-height:90vh;border-radius:10px;display:block;}",
      ".arc-image-modal-close{position:absolute;top:18px;right:18px;}",

      ".arcanju-size-guide{background:var(--arc-bg);color:var(--arc-text);font-family:var(--arc-font-body);padding:64px 20px;box-sizing:border-box;}",
      ".arc-size-section{max-width:1160px;margin:0 auto;}",
      ".arc-size-head{max-width:640px;margin-bottom:24px;}",
      ".arc-size-title{font-family:var(--arc-font-display);font-weight:800;font-size:clamp(26px,4vw,40px);letter-spacing:-0.01em;margin:0 0 14px;line-height:1.15;display:inline-block;}",
      ".arc-size-title::after{content:'';display:block;width:56px;height:3px;background:var(--arc-accent);margin-top:14px;}",
      ".arc-size-intro,.arc-size-below{color:var(--arc-text-muted);font-size:15px;line-height:1.6;margin:0;}",
      ".arc-size-below{margin-top:18px;max-width:640px;}",
      ".arc-size-guide-link{background:none;border:none;padding:0;font:inherit;cursor:pointer;color:var(--arc-accent);font-weight:700;text-decoration:underline;text-underline-offset:2px;}",
      ".arc-size-fit-tabs{margin-bottom:24px;}",
      ".arc-size-slider-wrap{margin-bottom:28px;max-width:520px;}",
      ".arc-size-track{position:relative;height:28px;display:flex;align-items:center;cursor:pointer;touch-action:none;}",
      ".arc-size-track::before{content:'';position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);height:5px;border-radius:3px;background:var(--arc-border);}",
      ".arc-size-track-fill{position:absolute;left:0;top:50%;transform:translateY(-50%);height:5px;border-radius:3px;background:var(--arc-accent);width:0%;pointer-events:none;transition:width .12s ease;}",
      ".arc-size-track-ticks{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;justify-content:space-between;pointer-events:none;}",
      ".arc-size-tick{width:5px;height:5px;border-radius:50%;background:var(--arc-bg);border:2px solid var(--arc-border);}",
      ".arc-size-track-thumb{position:absolute;top:50%;left:0%;width:24px;height:24px;border-radius:50%;background:var(--arc-accent);border:3px solid var(--arc-bg);box-shadow:0 0 0 1px var(--arc-accent), 0 3px 8px rgba(0,0,0,0.2);transform:translate(-50%,-50%);pointer-events:none;transition:left .12s ease;}",
      ".arc-size-track:focus-visible .arc-size-track-thumb{outline:2px solid var(--arc-accent);outline-offset:3px;}",
      ".arc-size-labels{display:flex;justify-content:space-between;margin-top:10px;}",
      ".arc-size-labels button{background:none;border:none;padding:2px 4px;cursor:pointer;font-size:12px;font-weight:600;color:var(--arc-text-muted);letter-spacing:.02em;transition:color .2s ease;}",
      ".arc-size-labels button.is-active{color:var(--arc-accent);}",
      ".arc-size-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}",
      ".arc-size-card{position:relative;aspect-ratio:3/4;border-radius:var(--arc-radius);overflow:hidden;border:1px solid var(--arc-border);background:var(--arc-surface);padding:0;cursor:pointer;transition:transform .3s ease,border-color .3s ease;}",
      ".arc-size-card:hover{transform:translateY(-3px);border-color:var(--arc-accent);}",
      ".arc-size-card:focus-visible{outline:2px solid var(--arc-accent);outline-offset:2px;}",
      ".arc-size-card img{width:100%;height:100%;object-fit:cover;display:block;}",
      ".arc-badge-stat{position:absolute;left:8px;bottom:8px;right:8px;background:rgba(14,14,16,0.6);backdrop-filter:blur(6px);border:1px solid rgba(245,243,238,0.18);color:#fff;font-size:10.5px;font-weight:600;letter-spacing:.01em;padding:5px 8px;border-radius:8px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".arc-size-more{display:block;margin:32px auto 0;background:var(--arc-cta-bg);border:1px solid var(--arc-cta-bg);color:var(--arc-cta-text);padding:13px 28px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:opacity .2s ease;}",
      ".arc-size-more:hover{opacity:.85;}",
      "@media (max-width:640px){",
      "  .arcanju-size-guide{padding:44px 16px;}",
      "  .arc-size-grid{grid-template-columns:repeat(2,1fr);gap:10px;}",
      "}",

      "@media (prefers-reduced-motion:reduce){.arc-card,.arc-card-img,.arc-lightbox{transition:none;}.arc-story-bar-fill.is-active{animation-duration:.01ms;}}"
    ].join("\n");
    document.head.appendChild(style);
  }
})();
