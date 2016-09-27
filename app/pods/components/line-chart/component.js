import Ember from 'ember';
import ChartCommon from 'qumla/mixins/chart-common';

export
default Ember.Component.extend(ChartCommon,{
    tagName: "",
    cid: 'line-chart',
    showLabelX: false,
    showLabelY: false,
    seriesList: null,
    labels: [],
    xaxis: [],
    series: [],
    allOptions: null,
    suffix: null,
    didInsertElement: function() {
        var chart = new Chartist.Line('#' + this.get('cid'), {
            labels: this.get('xaxis'),
            series: this.get('series'),
            area: this.get('series').length<5
        }, {
            fullWidth: true,
            lineSmooth: Chartist.Interpolation.cardinal({
                fillHoles: true,
            }),
            low: 0,
            chartPadding: {
                right:0,
                left:0
            }
        });
        var s=this.get('series');
        var suffix = this.get('suffix');
        chart.on('draw', function(data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.addClass('ct-hover'); 
                data.element.animate({
                    d: {
                        begin: 2000/s.length * data.index,
                        dur: 2000/s.length,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            }else if (data.type === 'label'){
                if(data.axis.units.dir==='vertical'){
                    if(parseInt(data.text,10)!==data.text){
                        data.element._node.innerHTML = '';
                    }else if(suffix){
                        data.element._node.innerHTML = '<span class="ct-label ct-vertical ct-start" style="height: 31px; width: 30px" >'+data.text+suffix+'</span>';
                    }
                }
                data.element.addClass('bar-chart-label');
            }
        });
    }
});