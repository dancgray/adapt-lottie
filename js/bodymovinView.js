define([
  'core/js/adapt',
  'core/js/views/componentView',
  'libraries/bodymovin'
],function(Adapt, ComponentView, Bodymovin) {

    var Bodymovin = ComponentView.extend({

        preRender: function() {
          this.listenTo(Adapt, 'device:resize', this.onScreenSizeChanged);
          this.listenTo(Adapt, 'device:changed', this.onDeviceChanged);
          this.listenTo(Adapt, 'accessibility:toggle', this.onAccessibilityToggle);
          this.listenTo(this.model, 'change:data', this.onDataChanged);
          this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();

            this.setupInview();
        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();

            if (!selector) {
                this.setCompletionStatus();
            } else {
                this.model.set('inviewElementSelector', selector);
                this.$(selector).on('inview', _.bind(this.inview, this));
            }
            console.log(this.model);
            var bodymovinMedia = this.model.get("_bodymovinMedia");
            var bodymovin = new Bodymovin();
            var animation = bodymovin.loadAnimation({
              container: document.getElementById('bodymovin'),
              renderer: this.model.get("_renderer"),
              loop: this.model.get("_loop"),
              autoplay: this.model.get("_autoplay"),
              path: bodymovinMedia.json
            });

        },

        /**
         * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
         */
        getInviewElementSelector: function() {
            if(this.model.get('body')) return '.component-body';

            if(this.model.get('instruction')) return '.component-instruction';

            if(this.model.get('displayTitle')) return '.component-title';

            return null;
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('inviewElementSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        },

        remove: function() {
            if(this.model.has('inviewElementSelector')) {
                this.$(this.model.get('inviewElementSelector')).off('inview');
            }

            ComponentView.prototype.remove.call(this);
        }
    });

    return Bodymovin;
});
