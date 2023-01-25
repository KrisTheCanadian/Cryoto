/* eslint-disable react-hooks/exhaustive-deps */
import {createContext, useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface Filter {
  filter: string;
  type: number;
  min?: number;
  max?: number;
}

interface Item {
  id: string;
  image: any;
  title: string;
  type: string;
  size?: string[];
  brand: string;
  points: number;
  description?: string;
}

interface CartItem {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string;
  quantity: number;
}

interface MarketplaceContextState {
  allItems: Item[];
  selectedFilters: Filter[];
  setSelectedFilters: any;
  selectSort: string;
  setSelectSort: any;
  itemsDisplayed: Item[];
  setItemsDisplayed: any;
  updateSortedItems: boolean;
  setUpdateSortedItems: any;
  addCartItems: any;
  cartItemsQuantity: number;
}

const tempItems = [
  {
    id: 'afd380c1-c643-4c6f-8454-60cb22585582',
    'title-en': 'Amazon 10$ Gift Card',
    'title-fr': 'Carte-cadeau Amazon de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Amazon',
    image:
      'https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png',
    points: 100,
  },
  {
    id: '26b80e6e-9690-4748-b6ef-869d72b5e4ec',
    'title-en': 'Amazon 50$ Gift Card',
    'title-fr': 'Carte-cadeau Amazon de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Amazon',
    image:
      'https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png',
    points: 500,
  },
  {
    id: '44e62432-1f38-4e4f-9468-61dc07ef1dd7',
    'title-en': 'Amazon 100$ Gift Card',
    'title-fr': 'Carte-cadeau Amazon de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Amazon',
    image:
      'https://m.media-amazon.com/images/G/15/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_ca-main._CB468775011_.png',
    points: 1000,
  },
  {
    id: 'bc9ed623-c582-4976-8577-2575f9739236',
    'title-en': 'Sephora 10$ Gift Card',
    'title-fr': 'Carte-cadeau Sephora de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Sephora',
    image:
      'https://mallmaverick.imgix.net/web/property_managers/27/properties/250/all/20220804155956/Sephora_logo.jpg',
    points: 100,
  },
  {
    id: '911c21e3-ed44-48c6-a91b-79cbca9b3962',
    'title-en': 'Sephora 50$ Gift Card',
    'title-fr': 'Carte-cadeau Sephora de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Sephora',
    image:
      'https://mallmaverick.imgix.net/web/property_managers/27/properties/250/all/20220804155956/Sephora_logo.jpg',
    points: 500,
  },
  {
    id: 'c9aa99ed-0b0a-407b-a485-5dd373cc8f5f',
    'title-en': 'Sephora 100$ Gift Card',
    'title-fr': 'Carte-cadeau Sephora de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Sephora',
    image:
      'https://mallmaverick.imgix.net/web/property_managers/27/properties/250/all/20220804155956/Sephora_logo.jpg',
    points: 1000,
  },
  {
    id: '5ef88cd1-4698-49fa-8df2-04a6e20cc7a7',
    'title-en': 'GAP 10$ Gift Card',
    'title-fr': 'Carte-cadeau GAP de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'GAP',
    image:
      'https://blackhawknetwork.com/on-demand/uk-en/wp-content/uploads/sites/3/2021/06/GAP.png',
    points: 100,
  },
  {
    id: 'fd1c7307-157a-45f2-b5d4-dd9abc249ba7',
    'title-en': 'GAP 50$ Gift Card',
    'title-fr': 'Carte-cadeau GAP de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'GAP',
    image:
      'https://blackhawknetwork.com/on-demand/uk-en/wp-content/uploads/sites/3/2021/06/GAP.png',
    points: 500,
  },
  {
    id: '3e417ada-9e1c-4f95-9d18-ae7e293037e7',
    'title-en': 'GAP 100$ Gift Card',
    'title-fr': 'Carte-cadeau GAP de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'GAP',
    image:
      'https://blackhawknetwork.com/on-demand/uk-en/wp-content/uploads/sites/3/2021/06/GAP.png',
    points: 1000,
  },
  {
    id: '0535346a-791d-4f1a-b317-3ecb680cf7b1',
    'title-en': 'TJX 10$ Gift Card',
    'title-fr': 'Carte-cadeau TJX de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'TJX',
    image:
      'https://assets.cardly.net/production/gift-cards/0/3/2/032ce6b0-a747-572b-902b-a28326ff0cc1/card-image/winners-homesense-marshalls-gift-card-fca45a95f9699a90066a30d31b3e7f13.webp',
    points: 100,
  },
  {
    id: 'aaacf4e0-a721-4721-a8f6-13a6c52dad4d',
    'title-en': 'TJX 50$ Gift Card',
    'title-fr': 'Carte-cadeau TJX de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'TJX',
    image:
      'https://assets.cardly.net/production/gift-cards/0/3/2/032ce6b0-a747-572b-902b-a28326ff0cc1/card-image/winners-homesense-marshalls-gift-card-fca45a95f9699a90066a30d31b3e7f13.webp',
    points: 500,
  },
  {
    id: 'df89de0c-c287-44e3-95e9-ff2980e7f7bd',
    'title-en': 'TJX 100$ Gift Card',
    'title-fr': 'Carte-cadeau TJX de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'TJX',
    image:
      'https://assets.cardly.net/production/gift-cards/0/3/2/032ce6b0-a747-572b-902b-a28326ff0cc1/card-image/winners-homesense-marshalls-gift-card-fca45a95f9699a90066a30d31b3e7f13.webp',
    points: 1000,
  },
  {
    id: '8a4376ff-367b-4893-8c50-d68533b95b20',
    'title-en': 'Cineplex 10$ Gift Card',
    'title-fr': 'Carte-cadeau Cineplex de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Cineplex',
    image: 'https://ssfinc.ca/sites/default/files/2022-10/Cineplex-logo.png',
    points: 100,
  },
  {
    id: 'afd79116-8558-400f-bf29-a755dcbc51d4',
    'title-en': 'Cineplex 50$ Gift Card',
    'title-fr': 'Carte-cadeau Cineplex de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Cineplex',
    image: 'https://ssfinc.ca/sites/default/files/2022-10/Cineplex-logo.png',
    points: 500,
  },
  {
    id: 'e448d97b-189d-41fb-b8c2-1cb683350bcd',
    'title-en': 'Company Cash $250 Deposit',
    'title-fr': "Dépôt de 250$ comptant d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 2500,
  },
  {
    id: '692d2f7c-f4bf-418c-a486-194944c60520',
    'title-en': 'Company RRSP $250 Deposit',
    'title-fr': "Dépôt de 250$ de REER d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 2500,
  },
  {
    id: '4b0b8254-0764-4d5c-a744-c5920c974191',
    'title-en': 'Company TFSA $250 Deposit',
    'title-fr': "Dépôt de 250$ de CELI d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 2500,
  },
  {
    id: 'bfe57729-720c-4740-ac52-d031272b6400',
    'title-en': 'Company Cash $500 Deposit',
    'title-fr': "Dépôt de 500$ comptant d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 5000,
  },
  {
    id: 'bd238f40-8a56-4f6d-a016-c9928d5935bd',
    'title-en': 'Company RRSP $500 Deposit',
    'title-fr': "Dépôt de 250$ de REER d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 5000,
  },
  {
    id: 'b0e714c6-ae70-4549-bb02-8a280cd0d0e1',
    'title-en': 'Company TFSA $500 Deposit',
    'title-fr': "Dépôt de 500$ de CELI d'entreprise",
    'type-en': 'Company Rewards',
    'type-fr': "Récompenses d'entreprise",
    brand: 'Company',
    image: 'https://i.imgur.com/qPkhdwq.png',
    points: 5000,
  },
  {
    id: 'd50f896f-daf2-4dfa-a435-0d79e94d3f10',
    'title-en': 'Company Water Bottle',
    'title-fr': "Bouteille d'eau d'entreprise",
    'type-en': 'Company Merchandise',
    'type-fr': "Marchandise d'entreprise",
    'description-en':
      'This stainless steel water bottle of 1L capacity has double-wall insulation and a loop cap for easy carrying. Keeps drinks cold or hot for hours.',
    'description-fr':
      'Cette bouteille d&apos;eau en acier inoxydable d&apos;une capacité de 1L est dotée d&apos;une isolation à double paroi et d&apos;un bouchon à boucle pour un transport facile. Elle permet de conserver les boissons froides ou chaudes pendant des heures.',
    brand: 'Company',
    image: 'https://i.imgur.com/kIZgIPD.png',
    points: 200,
    quantity: 100,
  },
  {
    id: '8cd06c1c-0f74-4483-b73e-f3d8514d6080',
    'title-en': 'Company Hoodie',
    'title-fr': "Chandail à capuchon d'entreprise",
    'type-en': 'Company Merchandise',
    'type-fr': "Marchandise d'entreprise",
    'description-en':
      'This comfortable cotton blend hoodie features our company logo, perfect for everyday wear and representing the brand. It has a drawstring hood and full zip front.',
    'description-fr':
      'Ce confortable hoodie en coton mélangé présente notre logo de société, parfait pour une tenue quotidienne et pour représenter la marque. Il possède un capuchon à cordons et une fermeture à glissière complète.',
    brand: 'Company',
    size: ['xs', 's', 'm', 'l', 'xl'],
    image: 'https://i.imgur.com/A8Yovfa.png',
    points: 300,
    quantity: 40,
  },

  {
    id: 'ec65b565-80f9-447c-89e8-8b38f523f3e4',
    'title-en': 'Company Cap',
    'title-fr': "Casquette d'entreprise",
    'type-en': 'Company Merchandise',
    'type-fr': "Marchandise d'entreprise",
    'description-en':
      'Stylish and durable cap, featuring a classic design and our company logo. It has an adjustable strap to ensure a perfect fit, and is made of breathable material to keep you cool and comfortable.',
    'description-fr':
      'Casquette stylée et durable, présentant un design classique et notre logo d&apos;entreprise. Dotée d&apos;une sangle réglable pour assurer un ajustement parfait, et fabriquée en matériau respirant pour vous garder au frais et à l&apos;aise.',
    brand: 'Company',
    image: 'https://i.imgur.com/KcwxRKp.png',
    points: 300,
    quantity: 10,
  },
  {
    id: '10896bc5-66c4-4026-8ede-8f754592bc60',
    'title-en': 'Company Polo',
    'title-fr': "Polo d'entreprise",
    'type-en': 'Company Merchandise',
    'type-fr': "Marchandise d'entreprise",
    'description-en':
      'This classic and versatile polo shirt, made of a soft cotton blend for ultimate comfort features our company logo. This shirt features a button-up placket and a classic collar, making it perfect for any occasion.',
    'description-fr':
      'Ce polo classique et versatile, confectionné dans un mélange de coton doux pour un confort optimal, porte le logo de l&aposentreprise. Doté d&aposune patte de boutonnage et d&aposun col classique, ce polo est parfait pour toutes les occasions.',
    brand: 'Company',
    size: ['xs', 's', 'm', 'l', 'xl'],
    image: 'https://i.imgur.com/o3fyfJh.png',
    points: 300,
    quantity: 50,
  },
  {
    id: '59b8e4cb-f25a-48e0-8211-a9cb7dfb87fd',
    'title-en': 'Uber Eats 10$ Gift Card',
    'title-fr': 'Carte-cadeau Uber Eats de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Uber',
    image:
      'https://gcgalore.com/wp-content/uploads/2019/03/Uber-Eats-Gift-Card-750x454.jpg',
    points: 100,
  },
  {
    id: 'c4e53519-5a8a-44bb-96cb-5ccb408a45b1',
    'title-en': 'Uber Eats 50$ Gift Card',
    'title-fr': 'Carte-cadeau Uber Eats de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',
    brand: 'Uber',
    image:
      'https://gcgalore.com/wp-content/uploads/2019/03/Uber-Eats-Gift-Card-750x454.jpg',
    points: 500,
  },
  {
    id: '00dd3fbc-5495-41be-8854-c852a4790c40',
    'title-en': 'Uber Eats 100$ Gift Card',
    'title-fr': 'Carte-cadeau Uber Eats de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Uber',
    image:
      'https://gcgalore.com/wp-content/uploads/2019/03/Uber-Eats-Gift-Card-750x454.jpg',
    points: 1000,
  },
  {
    id: '3f65dcab-8b24-46a8-8577-ab4de95a7ecb',
    'title-en': 'Uber 10$ Gift Card',
    'title-fr': 'Carte-cadeau Uber de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Uber',
    image: 'https://i.imgur.com/Z9Epyje.png',
    points: 100,
  },
  {
    id: 'e71bed21-5348-4aa8-8f75-6e8c746c88b6',
    'title-en': 'Uber 50$ Gift Card',
    'title-fr': 'Carte-cadeau Uber de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Uber',
    image: 'https://i.imgur.com/Z9Epyje.png',
    points: 500,
  },
  {
    id: 'a77d74ca-3e88-4588-b21a-b0320c0920ad',
    'title-en': 'Uber 100$ Gift Card',
    'title-fr': 'Carte-cadeau Uber de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Uber',
    image: 'https://i.imgur.com/Z9Epyje.png',
    points: 1000,
  },
  {
    id: '88ce2c2d-b0c5-40c2-8fbc-819ef660c3cd',
    'title-en': 'Air Canada 50$ Gift Card',
    'title-fr': 'Carte-cadeau Air Canada de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Air Canada',
    image:
      'https://productimages.nimbledeals.com/gift_card_skin/41ed4b70cbd02a11b4592ec1477fa529_1604993075847',
    points: 500,
  },
  {
    id: 'fb4dca6f-29e1-441a-86e0-1c1d9bc31715',
    'title-en': 'Air Canada 100$ Gift Card',
    'title-fr': 'Carte-cadeau Air Canada de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Air Canada',
    image:
      'https://productimages.nimbledeals.com/gift_card_skin/41ed4b70cbd02a11b4592ec1477fa529_1604993075847',
    points: 1000,
  },
  {
    id: '4d19a9d5-6f46-4b7e-8783-03b8ddf509be',
    'title-en': 'Air Canada 500$ Gift Card',
    'title-fr': 'Carte-cadeau Air Canada de 500$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'Air Canada',
    image:
      'https://productimages.nimbledeals.com/gift_card_skin/41ed4b70cbd02a11b4592ec1477fa529_1604993075847',
    points: 5000,
  },
  {
    id: 'd805a53e-1985-49a8-b137-dde5df371c52',
    'title-en': 'American Eagle 10$ Gift Card',
    'title-fr': 'Carte-cadeau American Eagle de 10$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'American Eagle',
    image:
      'https://assets.cardly.net/production/gift-cards/2/e/7/2e782d33-b002-35e5-ddc8-766f461ab36d/card-image/american-eagle-outfitters-gift-card-16fc372a7946ed13b3957743f5d06813.webp',
    points: 100,
  },
  {
    id: 'ebe728b5-e5dc-412d-8bdc-a41b82665930',
    'title-en': 'American Eagle 50$ Gift Card',
    'title-fr': 'Carte-cadeau American Eagle de 50$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'American Eagle',
    image:
      'https://assets.cardly.net/production/gift-cards/2/e/7/2e782d33-b002-35e5-ddc8-766f461ab36d/card-image/american-eagle-outfitters-gift-card-16fc372a7946ed13b3957743f5d06813.webp',
    points: 500,
  },
  {
    id: '46f29cee-85a8-4506-8331-d7c6d65fb46f',
    'title-en': 'American Eagle 100$ Gift Card',
    'title-fr': 'Carte-cadeau American Eagle de 100$',
    'type-en': 'Gift Card',
    'type-fr': 'Carte-cadeau',
    'description-en':
      'Electronic gift cards will be sent to the recipient&apos;s email when order is processed.',
    'description-fr':
      'Les cartes-cadeaux électroniques seront envoyées à l&apos;adresse électronique du destinataire lorsque la commande sera traitée.',

    brand: 'American Eagle',
    image:
      'https://assets.cardly.net/production/gift-cards/2/e/7/2e782d33-b002-35e5-ddc8-766f461ab36d/card-image/american-eagle-outfitters-gift-card-16fc372a7946ed13b3957743f5d06813.webp',
    points: 1000,
  },
];

const MarketplaceContext = createContext({} as MarketplaceContextState);

const MarketplaceProvider = (props: {children: any}) => {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  const itemsJsonTranslated: Item[] = [];

  tempItems.forEach((item: any) => {
    if (item?.quantity !== 0) {
      itemsJsonTranslated.push({
        id: item.id,
        image: item.image,
        title: lang === 'en' ? item['title-en'] : item['title-fr'],
        type: lang === 'en' ? item['type-en'] : item['type-fr'],
        description:
          lang === 'en' ? item['description-en'] : item['description-fr'],
        size: item.size,
        brand: item.brand,
        points: item.points,
      });
    }
  });

  itemsJsonTranslated.sort((item1, item2) =>
    item1.title.localeCompare(item2.title),
  );
  itemsJsonTranslated.sort((item1, item2) => item1.points - item2.points);

  const allItems = itemsJsonTranslated;
  const [itemsDisplayed, setItemsDisplayed] = useState(itemsJsonTranslated);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [updateSortedItems, setUpdateSortedItems] = useState(false);
  const [selectSort, setSelectSort] = useState<string>('');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  const addCartItems = (
    id: string,
    title: string,
    image: string,
    points: number,
    size: string,
    quantity: number,
  ) => {
    if (size === '') {
      const item = cartItems.find((i) => i.id === id);
      if (item) item.quantity += quantity;
      else setCartItems([...cartItems, {id, title, image, points, quantity}]);
    } else {
      const item = cartItems.find((i) => i.id === id && i.size === size);
      if (item) item.quantity += quantity;
      else
        setCartItems([
          ...cartItems,
          {id, title, image, points, size, quantity},
        ]);
    }
    setCartItemsQuantity(cartItemsQuantity + quantity);
  };

  const values = useMemo(() => {
    return {
      allItems,
      itemsDisplayed,
      setItemsDisplayed,
      selectedFilters,
      setSelectedFilters,
      selectSort,
      setSelectSort,
      updateSortedItems,
      setUpdateSortedItems,
      addCartItems,
      cartItemsQuantity,
    };
  }, [
    addCartItems,
    allItems,
    itemsDisplayed,
    selectSort,
    selectedFilters,
    updateSortedItems,
    cartItemsQuantity,
  ]);

  return (
    <MarketplaceContext.Provider value={values}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

function useMarketplaceContext() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      'useMarketplaceMenuContext must be used within a CountProvider',
    );
  }
  return context;
}

export {MarketplaceProvider, useMarketplaceContext};