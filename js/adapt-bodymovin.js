define([
    'coreJS/adapt',
    './bodymovinView',
    './bodymovinModel'
], function(Adapt, bodymovinView, bodymovinModel) {

    return Adapt.register("bodymovin", {
        view: bodymovinView,
        model: bodymovinModel
    });

});
