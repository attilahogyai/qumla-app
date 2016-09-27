export function initialize( container, application ) {
    application.inject('route', 'qstore', 'service:qstore');
    application.inject('controller', 'qstore', 'service:qstore');
    application.inject('component', 'qstore', 'service:qstore');
}

export default {
  name: 'qstore',
  initialize: initialize
}; 