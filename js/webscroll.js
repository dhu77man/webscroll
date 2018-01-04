window.webscrollRequestFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

var webscroll = {
    root: document.getElementById('root'),
    app: document.getElementById('app'),

    elements: {},
    sections: [],

    ratio: 0,
    thumbRatio: 0,

    options: {
        sections: 'section'
    },

    init: function(options){
        Object.prototype.extendOptions = function(foreign){
            var keys = Object.keys(foreign);
            for(var i = 0; i < keys.length; i++){
                this[keys[i]] = foreign[keys[i]]
            }
        }
        if(options){
            this.options.extendOptions(options);
        }

        console.log(this.options);

        this.build();
    },

    ready: function(){
        this.elements.thumb.style.height = ((window.innerHeight / app.offsetHeight) * this.elements.scrollbar.offsetHeight)+'px';
        this.updateRatio();
        this.resize();
        this.render();
        this.moveSections();

        var _this = this;
        window.addEventListener("resize", function(){
            _this.updateRatio();
            _this.resize();
            _this.moveSections();
        });

        this.render();
    },

    div: function(classList, parent, id, html){ // helper function for creating divs
        var e = document.createElement('div');
        e.classList = classList;
        if(id){ e.id = id; }
        if(html){ e.innerHTML = html; }
        parent.appendChild(e);
        return e;
    },

    build: function(){
        this.elements.scrollbar = this.div('', this.app, 'webscroll-scrollbar');
        this.elements.track = this.div('', this.elements.scrollbar, 'webscroll-track');
        this.elements.thumb = this.div('', this.elements.track, 'webscroll-thumb');

        if(this.options.sections){
            this.buildSections();
        }

        this.ready();
    },

    buildSections: function(){
        this.elements.sections = this.div('', this.elements.scrollbar, 'webscroll-sections');

        var sections = document.getElementsByClassName(this.options.sections);
        for(var i = 0; i < sections.length; i++){
            this.sections.push(
                {
                    bodySection: sections[i],
                    webscrollSection: this.div('webscroll-section', this.elements.sections, undefined, sections[i].getAttribute('role'))
                }
            )
        }
    },

    render: function(){
        webscroll.elements.thumb.style.top = (webscroll.ratio * webscroll.scrollRatio * root.scrollTop)+'px';
        webscrollRequestFrame(webscroll.render);
    },

    moveSections:  function(){
        for(var i = 0; i < webscroll.sections.length; i++){
            webscroll.sections[i].webscrollSection.style.top = Math.round(webscroll.ratio * webscroll.scrollRatio * webscroll.sections[i].bodySection.offsetTop) + 'px';
            webscroll.sections[i].webscrollSection.style.lineHeight = Math.round(webscroll.sections[i].bodySection.offsetHeight * webscroll.ratio * webscroll.scrollRatio) + 'px';
        }
    },

    updateRatio: function(){
        webscroll.ratio = window.innerHeight / app.offsetHeight;
        webscroll.scrollRatio = webscroll.elements.scrollbar.offsetHeight / window.innerHeight;
    },

    resize: function(){
        webscroll.elements.thumb.style.height = (webscroll.ratio * webscroll.elements.scrollbar.offsetHeight) + 'px';
        webscroll.elements.thumb.style.top = (webscroll.ratio * webscroll.scrollRatio * root.scrollTop) + 'px';
    }
}

webscroll.init();