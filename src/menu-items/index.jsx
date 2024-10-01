// project import
import category from './category';
import defaults from './defaults';
import facilities from './facilities';
import paymentTypes from './payment-types';
import reservations from './reservations';
import settings from './settings';

const menuItems = {
  items: [defaults, facilities, reservations, category, paymentTypes, settings]
};

export default menuItems;
