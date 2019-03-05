'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ZeroD documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' : 'data-target="#xs-components-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' :
                                            'id="xs-components-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                            <li class="link">
                                                <a href="components/AddAlertComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AddAlertComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HelpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewCardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' : 'data-target="#xs-directives-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' :
                                        'id="xs-directives-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                        <li class="link">
                                            <a href="directives/ScrollHideDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScrollHideDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' : 'data-target="#xs-injectables-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' :
                                        'id="xs-injectables-links-module-AppModule-ad2431cf08b969a8ae65fe93671d241c"' }>
                                        <li class="link">
                                            <a href="injectables/NetworkService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NetworkService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WeatherService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WeatherService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CustomLoading.html" data-type="entity-link">CustomLoading</a>
                            </li>
                            <li class="link">
                                <a href="modules/CustomModalModule.html" data-type="entity-link">CustomModalModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CustomToast.html" data-type="entity-link">CustomToast</a>
                            </li>
                            <li class="link">
                                <a href="modules/Tab1PageModule.html" data-type="entity-link">Tab1PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab1PageModule-d6b2e1ca43461c8cc701307d5e4049d6"' : 'data-target="#xs-components-links-module-Tab1PageModule-d6b2e1ca43461c8cc701307d5e4049d6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab1PageModule-d6b2e1ca43461c8cc701307d5e4049d6"' :
                                            'id="xs-components-links-module-Tab1PageModule-d6b2e1ca43461c8cc701307d5e4049d6"' }>
                                            <li class="link">
                                                <a href="components/Tab1Page.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Tab1Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Tab2PageModule.html" data-type="entity-link">Tab2PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Tab2PageModule-48b918bd2cdb1ddf6e3b5e3cc8ebbcc1"' : 'data-target="#xs-components-links-module-Tab2PageModule-48b918bd2cdb1ddf6e3b5e3cc8ebbcc1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Tab2PageModule-48b918bd2cdb1ddf6e3b5e3cc8ebbcc1"' :
                                            'id="xs-components-links-module-Tab2PageModule-48b918bd2cdb1ddf6e3b5e3cc8ebbcc1"' }>
                                            <li class="link">
                                                <a href="components/Tab2Page.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Tab2Page</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageModule.html" data-type="entity-link">TabsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabsPageModule-744f00854346f313b6500c0b5293c6cf"' : 'data-target="#xs-components-links-module-TabsPageModule-744f00854346f313b6500c0b5293c6cf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsPageModule-744f00854346f313b6500c0b5293c6cf"' :
                                            'id="xs-components-links-module-TabsPageModule-744f00854346f313b6500c0b5293c6cf"' }>
                                            <li class="link">
                                                <a href="components/TabsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageRoutingModule.html" data-type="entity-link">TabsPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BackbuttonService.html" data-type="entity-link">BackbuttonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CloudserviceService.html" data-type="entity-link">CloudserviceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavegacionService.html" data-type="entity-link">NavegacionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkService.html" data-type="entity-link">NetworkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemingService.html" data-type="entity-link">ThemingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherService.html" data-type="entity-link">WeatherService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/iAccidente.html" data-type="entity-link">iAccidente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/iMeteorology.html" data-type="entity-link">iMeteorology</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScrollHideConfig.html" data-type="entity-link">ScrollHideConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Theme.html" data-type="entity-link">Theme</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ThemeStyle.html" data-type="entity-link">ThemeStyle</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});