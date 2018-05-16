// Time to load out THNG
// ***************
function loadThng(appId, appMenu) {

    if (!thngId) {

        // Fall-back if no THNG ID found in URL
        // ***************
        $('body').addClass('start');

    } else {

        // Create anon user / retrieve created anon user
        // ***************
        getUser(appId)

        // Read our THNG and build the screen
        // ***************
        .then(readThng);

        function readThng(user) {

            // Read thng, then product to get the picture to show on the App
            // ***************
            user.thng(thngId).read().then(function(thng) {

            // Get location off first scan, if there is a localStorage location set
            var appLocationCity = localStorage.getItem('locationCity');
            var appLocationRegion = localStorage.getItem('locationRegion');

            if (appLocationCity === null) {

                // Add our initial scan Action
                // ***************
                addScanBasedOnState(thngId, state, appId, appMenu, user).then(() => {

                    locationContextText(localStorage.locationCity, localStorage.locationRegion);

                    if (thng.customFields.timeline01) {
                        showTimeLine(customFieldArrayToJson('timeline', thng.customFields), localStorage.locationCity, localStorage.locationRegion);
                    }

                });

            } else {

                // Add our scan Action
                // ***************
                addScanBasedOnState(thngId, state, appId, appMenu, user);

                locationContextText(appLocationCity, appLocationRegion);

                if (thng.customFields.timeline01) {
                    showTimeLine(customFieldArrayToJson('timeline', thng.customFields), appLocationCity, appLocationRegion);
                }
            }

            user.product(thng.product).read().then(function(product) {

                    // save SKU Data for Counterfeit Checking
                    productCustomFields = product.customFields;

                    // Global/standard template population
                    // ***************
                    if (state != 'owned') {

                        // Global defaults (h1: name of THNG, primary p: description of THNG, button: customField button - text defaults to blank if no content provided)
                        // ***************
                        populateThngTemplate(state, thng);

                    }

                    if (state == 'offer') {

                        user.thng(thngId).property('post-purchase').read().then(function(results) {
                            // If there is such a property, and it is 'true'
                            if(results.length && results[0].value) {
                                state = 'post-purchase';
                                populateThngTemplate(state, thng);

                                $('#post-purchase .post-purchase-offer-txt').html(thng.customFields.postPurchaseText);
                                $('#post-purchase .post-purchase-offer-txt-optional').html(thng.customFields.postPurchaseOfferBox);
                            } else {
                                state = 'offer';
                            }

                            $('body').addClass(state);
                        });

                        $('.make-post-purchase').click(function(){
                            alertBox('Offer Redeemed', 'Check your email for additional offers', 'Close');
                            user.thng(thngId).property('post-purchase').update(true);
                            return false;
                        });

                        $('.remove-post-purchase').click(function(){
                            alertBox('Offer Revoked', 'Item returned to pre-purchase state', 'Close');
                            user.thng(thngId).property('post-purchase').update(false);
                            return false;
                        });

                    } else {

                        $('body').addClass(state);

                    }

                    if (state == 'owned') {

                        if (thng.description) {

                            $('#owned h1').html(escapeHtml(thng.description));

                        } else {

                            $('#owned h1').html('Owned');

                        }

                        getOwnedThngs(user);

                    }

                    if (state == 'grey') {

                        $('#grey .intended-market').html(thng.customFields.destination);
                        $('#grey .scanned').html(thng.customFields.scanned);

                    }

                    if (state == 'registration') {

                        $('#grey .intended-market').html(thng.customFields.destination);
                        $('#grey .scanned').html(thng.customFields.scanned);

                        if(thng.customFields.showAutomaticPurchaseDate) {
                            registration.date = todaysDate();
                            $('.registrationPurchaseDate').addClass('show');
                            $('.registrationPurchaseDate input').val(registration.date);
                        }

                        $('#registration .button').click(function(){
                            alertBox('Product Registered', 'Your registration information has been submitted successfully.', 'Close');
                            return false;
                        });

                    }

                    if (state == 'reward') {

                        // Run function to switch between new reward and one scan away from reward.
                        // ***************
                        rewardStatus();

                        $('#reward .scan-reward .prod-list-name').html(thng.customFields.newRewardTitle);
                        $('#reward .scan-reward .prod-list-price').html(thng.customFields.newRewardRedeemDate);

                        $('#reward .button').click(function(){
                            alertBox('Reward Claimed', 'Please check your email for further details.', 'Close');
                            return false;
                        });

                    }

                    if (state == 'counterfeitcheck') {

                        $('#counterfeitcheck h1').html(escapeHtml(thng.name));

                        if(thng.customFields.counterfeit == 'true') {
                            $('#counterfeitcheck').addClass('true');
                            $('#counterfeitcheck .button').html(escapeHtml(thng.customFields.button));
                        }
                        if(thng.customFields.counterfeit == 'false') {
                            $('#counterfeitcheck').addClass('false');
                        }

                        if(thng.customFields.styleDiscColor) {
                            $('head').append('<style>.counterfeitcheck #counterfeitcheck .offer-disc.true {background:' + thng.customFields.styleDiscColor + '}</style>');
                        }

                    }

                    if (state == 'freestanding') {

                      $(".radiocheck .option").change(function() {

                        if(this.checked) {
                          $('.uploadButton').addClass('on');
                        } else {
                          $('.uploadButton').removeClass('on');
                        }

                      });

                      $("#freestanding_upload").change(function (){

                        $('.alert__button').unbind('click'); // Make the alert NOT hide everything/reset the app

                        $("#loader").addClass('on');

                        var refreshImageLink = setInterval(function(){

                          var imageLink = $('#imageInfo').val();

                            if(imageLink != 'waiting'){ // Check that Cloudinary has refereshed element

                              clearInterval(refreshImageLink);

                              var imageRef = $('#imageInfo').val();
                              var selectedOptionValue = $('input[name=status]:checked').val();

                              var icon = 'mdi-camera';
                              var date = todaysDate();
                              var title = '' + selectedOptionValue + ' Photo Added by You';
                              var location = '';
                              var imageUploadedUrl = imageRef;
                              var imageArr = imageUploadedUrl.split('/');
                              var extra = '<img src="https://res.cloudinary.com/evrythng/image/upload/w_600,h_600,c_fill/' + imageArr[2] + '/' + imageArr[3] + '/' + imageArr[4] + '" style="width:100%;" />';
                              addTimelineEvent(icon, date, title, location, extra);

                              $('#loader').removeClass('on');
                              $('.uploadButton').removeClass('on');
                              $('.radiocheck .option').prop('checked', false);

                              alertBox('Image Uploaded', 'Please check timeline for details.', 'Ok');


                              $('body').on('click', '.alert__button', function(){
                                $('.alert').removeClass('on');
                                return false;
                              });

                            }

                        }, 1500);

                      });

                    }

                    // Check for photos - provide fallback if no photo found
                    // ***************
                    if (product.photos) {
                        $('.hero').css('background-image', 'url(' + product.photos[0] + ')');
                    } else {
                        $('.hero').css('background-image', 'url(/assets/placeholder.png)');
                    }

                    if (thng.customFields.price) {
                        $('.price').html(thng.customFields.price);
                    }

                    if(thng.customFields.video) {
                        $('#offer, #post-purchase, #reorder').addClass('video-on');
                        $('#video .video iframe').attr('src', 'https://www.youtube.com/embed/'+ thng.customFields.video +'?autoplay=0&modestbranding=1&rel=0&showinfo=0');
                        $(".video").fitVids();
                    }

                    // Add a bespoke Alert to page button
                    // ***************
                    if(thng.customFields.bespokeAlert01) {

                        var bespokeAlert = JSON.parse(customFieldArrayToJson('bespokeAlert', thng.customFields));

                        $('#' + state + ' .button').click(function(){
                            alertBox(bespokeAlert[0].title, bespokeAlert[0].message, bespokeAlert[0].button);
                            return false;
                        });
                    }

                    // Read reviews items
                    // ***************
                    if (thng.customFields.review01) {
                        showReviews(customFieldArrayToJson('review', thng.customFields));
                    } else {
                        $('.rating-summary').removeClass('overlay-toggle');
                    }

                    // Read provenance items
                    // ***************
                    if (thng.customFields.provenance01) {
                        showProvenance(customFieldArrayToJson('provenance', thng.customFields));
                    }

                    // Read sustainability items
                    // ***************
                    if (thng.customFields.sustainability01) {
                        showSustainability(customFieldArrayToJson('sustainability', thng.customFields))
                    }

                    // Read registration items
                    // ***************
                    if (thng.customFields.form01) {
                        registrationInputs(customFieldArrayToJson('form', thng.customFields));
                    }

                    // Read previous reward items
                    // ***************
                    if (thng.customFields.previousReward01) {
                        previousRewards(customFieldArrayToJson('previousReward', thng.customFields));
                    } else {
                        $('.previous-rewards').removeClass('show');
                    }

                    // Read reorder items
                    // ***************
                    if (thng.customFields.reorder01) {
                        showReorder(customFieldArrayToJson('reorder', thng.customFields));
                    }

                    // Read additional links JSON
                    // ***************
                    if (thng.customFields.link01) {
                        showAdditionalLinks(customFieldArrayToJson('link', thng.customFields));
                    } else {
                        $('.additional-links').addClass('hide');
                    }

                    if (thng.customFields.showRecommended == 'true') {
                        $('.recommended').addClass('on');
                        getRecommendedList(user);
                    }

                    if (thng.customFields.dutypaid) {
                        if(thng.customFields.dutypaid == 'true') {
                            $('#dutycheck').addClass('true');
                        }
                        if(thng.customFields.dutypaid == 'false') {
                            $('#dutycheck').addClass('false');
                        }
                    }
                })

            });

        }
    }

}
// Template Population END
