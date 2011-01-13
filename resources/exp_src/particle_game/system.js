
var Vector = new Class({
    
    initialize: function(x, y){
        this.x = x || 0;
        this.y = y || 0;
    },
    
    add: function(){
        return new Vector(this.x + vector.x, this.y + vector.y);
    },
    
    subtract: function(vector){
        return new Vector(this.x - vector.x, this.y - vector.y);
    },
    
    multiply: function(value){
        return new Vector(this.x * value, this.y * value);
    },
    
    length: function(){
        return (this.x * this.x + this.y * this.y).sqrt();
    },
    
    round: function(){
        return new Vector(this.x.round(), this.y.round());
    }
    
});

var System = new Class({
    
    wells: [],
    particles: [],
    
    addParticle: function(particle){
        this.particles.push(particles);
    },
    
    addWell: function(well){
        this.wells.push(well);
    },
    
    update: function(){
        var particles = this.particles,
            wells = this.wells;
        
        
        particles.each(function(particle){
            var acceleration = new Vector(),
                position = partical.current;
            
            wells.each(function(well){
                acceleration = acceleration.add(well.acceleration(position));
            });
            
            particle.acceleration = acceleration;
            particle.update();
        });
        
    },
    
    draw: function(){
        var particles = this.particles,
            wells = this.wells;
        
        particles.each(function(particle){
            particle.draw();
        });
        
        wells.each(function(well){
            well.draw();
        });
    }
    
});

var Particle = new Class({
    
    current: new Vector(),
    previous: new Vector(),
    acceleration: new Vector(),
    
    initialize: function(position){
        ['x', 'y'].each(function(prop){
            this.current[prop] = position[prop];
        }, this);
    },
    
    update: function(dt){
        var temp = this.current;
        this.current = this.acceleration.multiply(dt*dt).add(temp.multiply(2).subtract(this.previous));
        this.previous = temp;
        // TODO check bounds?
    },
    
    draw: function(){
        
    }
    
});

var Well = new Class({
    
    Implements: Particle,
    
    mass: 0,
    radius: 0,
    
    acceleration: function(position){
        var vector = position.subtract(this.current),
            distance = vector.length();
        
        return vector.multiply(-this.mass / (distance*distance / 2));
    },
    
    inside: function(position){
        return (position.subtract(this.current).length() - this.radius) < 1;
    }
    
});

var Canvas = new Class({
    
    Implements: Events,
    
    initialize: function(id){
        var element = this.element = document.id(id),
            width = this.width = element.getWidth(),
            height = this.height = element.getHeight();
        
        this.dimension = Math.max(width, height);
        
        element.addEvents({
            mousedown: this.mousedown.bind(this),
            mouseup: this.mouseup.bind(this),
            mousemove: this.mousemove.bind(this)
        });
    },
    
    position: function(event){
        var cursor = event.page,
            element = this.element.getPosition(),
            dimension = this.dimension;
            result = new Vector();
        
        ['x', 'y'].each(function(coord){
            result[coord] = (cursor[coord] - element[coord]) / dimension;
        });
        
        return result;
    },
    
    mousedown: function(event){
        this.fireEvent('mousedown', this.position(event));
    },
    
    mouseup: function(event){
        this.fireEvent('mouseup', this.position(event));
    },
    
    mousemove: function(event){
        this.fireEvent('mousemove', this.position(event));
    },
    
    toPixel: function(vector){
        return vector.multiply(this.dimension).round();
    }
    
});


var canvas = new Canvas('canvas').addEvent('loaded', function(){
    console.log('loaded');
});

canvas.addEvent('mousemove', function(position){
    position = canvas.toPixel(position);
    console.log('click', position.x, position.y);
});
