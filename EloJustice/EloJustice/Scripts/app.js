    function EloJustice(attrs) {
        var image_path = '/images/';
        this._products = {
            b5: {
                id: 0,
                price: 0,
                image: image_path + 'bronze.png'
            },
            b4: {
                id: 62,
                price: 36,
                image: image_path + 'bronze.png'
            },
            b3: {
                id: 63,
                price: 36,
                image: image_path + 'bronze.png'
            },
            b2: {
                id: 64,
                price: 36,
                image: image_path + 'bronze.png'
            },
            b1: {
                id: 108,
                price: 36,
                image: image_path + 'bronze.png'
            },
            s5: {
                id: 67,
                price: 42,
                image: image_path + 'silver.png'
            },
            s4: {
                id: 68,
                price: 42,
                image: image_path + 'silver.png'
            },
            s3: {
                id: 69,
                price: 42,
                image: image_path + 'silver.png'
            },
            s2: {
                id: 70,
                price: 42,
                image: image_path + 'silver.png'
            },
            s1: {
                id: 71,
                price: 42,
                image: image_path + 'silver.png'
            },
            g5: {
                id: 72,
                price: 46,
                image: image_path + 'gold.png'
            },
            g4: {
                id: 73,
                price: 48,
                image: image_path + 'gold.png'
            },
            g3: {
                id: 74,
                price: 48,
                image: image_path + 'gold.png'
            },
            g2: {
                id: 75,
                price: 48,
                image: image_path + 'gold.png'
            },
            g1: {
                id: 76,
                price: 48,
                image: image_path + 'gold.png'
            },
            p5: {
                id: 77,
                price: 60,
                image: image_path + 'platinum.png'
            },
            p4: {
                id: 78,
                price: 65,
                image: image_path + 'platinum.png'
            },
            p3: {
                id: 79,
                price: 65,
                image: image_path + 'platinum.png'
            },
            p2: {
                id: 80,
                price: 65,
                image: image_path + 'platinum.png'
            },
            p1: {
                id: 81,
                price: 65,
                image: image_path + 'platinum.png'
            },
            d5: {
                id: 82,
                price: 75,
                image: image_path + 'diamond.png'
            },
            d4: {
                id: 84,
                price: 180,
                image: image_path + 'diamond.png'
            },
            d3: {
                id: 85,
                price: 180,
                image: image_path + 'diamond.png'
            },
            d2: {
                id: 194,
                price: 250,
                image: image_path + 'diamond.png'
            },
            d1: {
                id: 195,
                price: 300,
                image: image_path + 'diamond.png'
            }
        };
        this.currencyFormat = 'R$';
        this.currencyDecimalSeparator = ',';
        this._errorMessages = {
            dest_lt_cur: "Não é possível escolher posição menor que a atual"
        }
        this._sequence = ['b5', 'b4', 'b3', 'b2', 'b1', 's5', 's4', 's3', 's2', 's1', 'g5', 'g4', 'g3', 'g2', 'g1', 'p5', 'p4', 'p3', 'p2', 'p1', 'd5', 'd4', 'd3', 'd2', 'd1'];
        this.errors = [];
        this.settings = function(attrs) {
            for (var key in attrs) {
                this[key] = attrs[key];
            }
            this._attachAddToCart();
            return this;
        }
        this.change = function() {
            this.ck = $(this.selectCurrentTier).val() + $(this.selectCurrentDivision).val();
            this.dk = $(this.selectDestinationTier).val() + $(this.selectDestinationDivision).val();
            this.current = this._products[this.ck];
            this.destination = this._products[this.dk];
            this.updateImage();
            var price = this.sumValue();
            $(this.priceContainer).text(this._formatCurrency(price));
            return this;
        }
        this.updateImage = function() {
            $(this.currentWrapImage).css('background-image', 'url(' + this.current.image + ')');
            $(this.destinationWrapImage).css('background-image', 'url(' + this.destination.image + ')');
        }
        this.sumValue = function() {
            this._getSequence();
            if (this.i_dest < this.i_cur) {
                this._addError('dest_gt_cur');
                return false;
            }
            var sum = 0;
            this._execInSequence(function(p, k) {
                sum += p.price;
            });
            return sum;
        }
        this.addToCart = function() {
            var evo = this;
            if (evo.beforeAddToCart) evo.beforeAddToCart();
            evo._getSequence();
            var products = [];
            evo._execInSequence(function(p) {
                products.push(p);
            });

            function ajaxOrRedirectToCart(_products) {
                var p = products.shift();
                if (!p) {
                    window.parent.location = evo.cartUrl;
                }
                var url = evo.addToCartUrl.replace('%product_id', p.id);
                jQuery.get(url).success(function() {
                    ajaxOrRedirectToCart(_products);
                });
            }
            ajaxOrRedirectToCart(products);
        }
        this.errorMessages = function() {
            var trErrors = [];
            for (var i = 0; i < this.errors.length; i++) {
                var k = this.errors[i];
                if (this._errorMessages[k]) {
                    trErrors.push(this._errorMessages[k]);
                } else {
                    trErrors.push(k);
                }
                return trErrors;
            }
        }
        this._getSequence = function() {
            for (var i = 0; i < this._sequence.length; i++) {
                if (this.ck === this._sequence[i]) {
                    this.i_cur = i;
                }
                if (this.dk === this._sequence[i]) {
                    this.i_dest = i;
                }
            }
        }
        this._execInSequence = function(func) {
            for (var i = this.i_cur + 1; i <= this.i_dest; i++) {
                var p_key = this._sequence[i];
                var product = this._products[p_key];
                func(product, p_key);
            }
        }
        this._formatCurrency = function(val) {
            var o = [];
            var decPart = new String(parseInt((val - parseInt(val)) * Math.pow(10, this._currencyDecimalQty)) || 0);
            var intPart = new String(parseInt(val) || 0);
            if (decPart < 10) {
                decPart = "0" + decPart;
            }
            o.push(this.currencyFormat);
            o.push(' ')
            o.push(intPart);
            o.push(this.currencyDecimalSeparator);
            o.push(decPart);
            return o.join('');
        }
        this._attachAddToCart = function() {
            var evo = this;
            jQuery(evo.addToCartButton).click(function() {
                evo.addToCart();
            });
        }
        this._addError = function(err) {
            this.errors.push(err);
        }
        this.init = function(attrs) {
            if (attrs) {
                this.settings(attrs);
            }
        }
        this.init(attrs);
    }
$(function() {
    var evo = new EloJustice({
        selectCurrentTier: '#ct',
        selectCurrentDivision: '#cd',
        selectDestinationTier: '#dt',
        selectDestinationDivision: '#dd',
        currentWrapImage: '#cti',
        destinationWrapImage: '#dti',
        priceContainer: '#price',
        addToCartButton: '#cart',
        addToCartUrl: '/?post_type=product&add-to-cart=%product_id',
        cartUrl: '/carrinho',
        beforeAddToCart: function() {
            jQuery('#loader').show();
        }
    }).change();
    $('#ct,#cd,#dt,#dd').change(function() {
        evo.change();
    });
});