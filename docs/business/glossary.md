# Working glossary

Keep Czech terms from the old application visible during discovery. English
translations below are working explanations, not a finalized domain naming
decision. Resolve ambiguous terms with the business owner.

| Legacy term | Working meaning | Important distinction |
| --- | --- | --- |
| Projekt | Site/commercial project spanning inquiry through delivery | Not a quote revision |
| Poptávka | Incoming inquiry; also the historic name of the project table | Not necessarily a separate entity |
| Nabídka / CN | Price quotation (`cenová nabídka`); also a project stage | Distinguish draft, issued document and project status |
| Koncept / rozpracovaná | Editable saved quotation draft | Can coexist with issued revisions |
| Platná CN | Quote selected for project financials/downstream work | Not necessarily the newest draft or newest issued revision |
| Uchazeč | Bidding customer/company for the same site | Not an employee, app user or bidder for supplying our material |
| Zákazník / odběratel | Customer/buyer | Can differ from investor and broker |
| Investor | Party for whom the site is built; used in price-level comparison | Not automatically the quote recipient |
| Konfigurace | Product and common specification applied to positions | Can appear in several groups |
| Varianta | Priced/displayed group of configured work | Overloaded; not the same as a quote revision |
| Podvarianta | Usually a derived accessory section | Do not conflate with apartment/floor grouping |
| Pozice | Labelled product/opening row with dimensions and quantity | A row can represent several pieces |
| Kostra nabídky | Skeleton of configurations and links | Not the pricing result itself |
| Rozpad | Grouping/splitting by building, apartment, floor, facade or stage | Can affect installation/transport price, not just layout |
| Provázání | Live dependency on another configuration's positions | Different from copying positions once |
| Odchylka | Position-specific change from common or imported input | Can affect linked products and whole-quote cost |
| Nákup | Purchase/cost basis, including relevant installation/delivery cost | Different from selling price |
| Prodej | Our selling value | Customer-facing commission/tax totals can differ |
| Rabat | Rebate/discount used in purchase-price calculation | Not automatically a customer-visible discount |
| Přirážka | Markup on cost | `(sell - cost) / cost` |
| Marže | Often reported gross margin, but some fields actually hold markup | Always identify denominator; see [PRICE-09](../legacy/configurator-pricing.md#price-09--markup-margin-overhead-and-profit) |
| Rozvaha | Quote financial summary: costs, sales, margin, overhead, profit | Not the company operating budget |
| Režie | Allocated overhead, derived from annual plan inputs | Not a supplier surcharge |
| Risk / rezerva | Selected installation reserve | Not a percentage of every quote component |
| MOC / ceníková cena | Reference/list price for comparison/displayed discount | Needs an approved source and interpretation |
| Cenová hladina | Price level in Kč/m², Kč/bm, Kč/ks or another agreed basis | Not a universal price per project |
| Světlá výška | Clear opening height | Product height may add box/packet height |
| Výška výrobku | Manufacturing/product height | Not the gallery sheet height in every product path |
| KG / krycí galerie | Cover gallery/sheet assembly | Different manufacturing formula from a concealed box |
| Podomítkový box | Concealed box above an opening | Often linked to a blind but can be configured independently |
| Montáž | Installation work/cost | Quantity bands and grouping matter |
| Doprava | Delivery/travel cost | One-way distance is doubled per trip in current calculation |
| DPH / PDP | VAT / reverse charge | Tax treatment needs owner/accounting validation |
| SoD | Contract for work (`smlouva o dílo`) | Mostly beyond the initial rewrite |
| SPP | Work statement (`soupis provedených prací`) | Downstream consumer, not the initial quote editor |
| Slovo | Permission to be the current editor of a configuration workspace | A lease/handoff mechanism, not a substitute for access rights |
| ABRA | External ERP system referenced by the app | Confirm actual integration and field ownership |

For source evidence and current behavior, use the
[workflow](../legacy/auth-projects-quotes.md) and
[pricing](../legacy/configurator-pricing.md) findings rather than this glossary
as a standalone specification.
