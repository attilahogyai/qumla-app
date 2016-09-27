import Ember from 'ember';

export function grad(params) {
	var s=params[0];

	s=s.replace('#25','twenty-fifth');
	s=s.replace('#24','twenty-fourth');
	s=s.replace('#23','twenty-third');
	s=s.replace('#22','twenty-second');
	s=s.replace('#21','twenty-first');	
	s=s.replace('#20','twentieth');
	s=s.replace('#19','nineteenth');
	s=s.replace('#18','eighteenth');
	s=s.replace('#17','seventeenth');
	s=s.replace('#16','sixteenth');
	s=s.replace('#15','fifteenth');
	s=s.replace('#14','fourteenth');
	s=s.replace('#13','thirteenth');
	s=s.replace('#12','twelfth');
	s=s.replace('#11','eleventh');
	s=s.replace('#10','tenth');
	s=s.replace('#9','nineth');
	s=s.replace('#8','eight');
	s=s.replace('#7','seventh');
	s=s.replace('#6','sixth');
	s=s.replace('#5','fifth');
	s=s.replace('#4','fourth');
	s=s.replace('#3','third');
	s=s.replace('#2','second');
	s=s.replace('#1','first');

	return s;	
}

export default Ember.HTMLBars.makeBoundHelper(grad);