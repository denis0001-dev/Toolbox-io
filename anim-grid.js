var $8zHUo$popmotioneasing = require("@popmotion/easing");
var $8zHUo$framesync = require("framesync");
var $8zHUo$lodashthrottle = require("lodash.throttle");
var $8zHUo$popmotion = require("popmotion");

function $parcel$interopDefault(a) {
    return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
    Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "wrapGrid", () => $882b6d93070905b3$export$cfa74da6327324bf);
/* eslint-disable @typescript-eslint/no-empty-function */



const $882b6d93070905b3$var$popmotionEasing = {
    anticipate: $8zHUo$popmotioneasing.anticipate,
    backIn: $8zHUo$popmotioneasing.backIn,
    backInOut: $8zHUo$popmotioneasing.backInOut,
    backOut: $8zHUo$popmotioneasing.backOut,
    circIn: $8zHUo$popmotioneasing.circIn,
    circInOut: $8zHUo$popmotioneasing.circInOut,
    circOut: $8zHUo$popmotioneasing.circOut,
    easeIn: $8zHUo$popmotioneasing.easeIn,
    easeInOut: $8zHUo$popmotioneasing.easeInOut,
    easeOut: $8zHUo$popmotioneasing.easeOut,
    linear: $8zHUo$popmotioneasing.linear
};
const $882b6d93070905b3$var$DATASET_KEY = "animateGridId";
// in order to account for scroll, (which we're not listening for)
// always cache the item's position relative
// to the top and left of the grid container
const $882b6d93070905b3$var$getGridAwareBoundingClientRect = (gridBoundingClientRect, el)=>{
    const { top: top , left: left , width: width , height: height  } = el.getBoundingClientRect();
    const rect = {
        top: top,
        left: left,
        width: width,
        height: height
    };
    rect.top -= gridBoundingClientRect.top;
    rect.left -= gridBoundingClientRect.left;
    // if an element is display:none it will return top: 0 and left:0
    // rather than saying it's still in the containing element
    // so we need to use Math.max to make sure the coordinates stay
    // within the container
    rect.top = Math.max(rect.top, 0);
    rect.left = Math.max(rect.left, 0);
    return rect;
};
// the function used during the tweening
const $882b6d93070905b3$var$applyCoordTransform = (el, { translateX: translateX , translateY: translateY , scaleX: scaleX , scaleY: scaleY  }, { immediate: immediate  } = {})=>{
    const isFinished = translateX === 0 && translateY === 0 && scaleX === 1 && scaleY === 1;
    const styleEl = ()=>{
        el.style.transform = isFinished ? "" : `translateX(${translateX}px) translateY(${translateY}px) scaleX(${scaleX}) scaleY(${scaleY})`;
    };
    if (immediate) styleEl();
    else (0, ($parcel$interopDefault($8zHUo$framesync))).render(styleEl);
    const firstChild = el.children[0];
    if (firstChild) {
        const styleChild = ()=>{
            firstChild.style.transform = isFinished ? "" : `scaleX(${1 / scaleX}) scaleY(${1 / scaleY})`;
        };
        if (immediate) styleChild();
        else (0, ($parcel$interopDefault($8zHUo$framesync))).render(styleChild);
    }
};
const $882b6d93070905b3$export$cfa74da6327324bf = (container, { duration: duration = 250 , stagger: stagger = 0 , easing: easing = "easeInOut" , onStart: onStart = ()=>{} , onEnd: onEnd = ()=>{}  } = {})=>{
    if (!$882b6d93070905b3$var$popmotionEasing[easing]) throw new Error(`${easing} is not a valid easing name`);
    let mutationsDisabled = false;
    const disableMutationsWhileFunctionRuns = (func)=>{
        mutationsDisabled = true;
        func();
        setTimeout(()=>{
            mutationsDisabled = false;
        }, 0);
    };
    // all cached position data, and in-progress tween data, is stored here
    const cachedPositionData = {};
    // initially and after every transition, record element positions
    const recordPositions = (elements)=>{
        const gridBoundingClientRect = container.getBoundingClientRect();
        Array.from(elements).forEach((el)=>{
            if (typeof el.getBoundingClientRect !== "function") return;
            if (!el.dataset[$882b6d93070905b3$var$DATASET_KEY]) {
                const newId = `${Math.random()}`;
                el.dataset[$882b6d93070905b3$var$DATASET_KEY] = newId;
            }
            const animateGridId = el.dataset[$882b6d93070905b3$var$DATASET_KEY];
            if (!cachedPositionData[animateGridId]) cachedPositionData[animateGridId] = {};
            const rect = $882b6d93070905b3$var$getGridAwareBoundingClientRect(gridBoundingClientRect, el);
            cachedPositionData[animateGridId].rect = rect;
            cachedPositionData[animateGridId].gridBoundingClientRect = gridBoundingClientRect;
        });
    };
    recordPositions(container.children);
    const throttledResizeListener = (0, ($parcel$interopDefault($8zHUo$lodashthrottle)))(()=>{
        const bodyElement = document.querySelector("body");
        const containerIsNoLongerInPage = bodyElement && !bodyElement.contains(container);
        if (!container || containerIsNoLongerInPage) window.removeEventListener("resize", throttledResizeListener);
        recordPositions(container.children);
    }, 250);
    window.addEventListener("resize", throttledResizeListener);
    const throttledScrollListener = (0, ($parcel$interopDefault($8zHUo$lodashthrottle)))(()=>{
        recordPositions(container.children);
    }, 20);
    container.addEventListener("scroll", throttledScrollListener);
    const mutationCallback = (mutationsList)=>{
        if (mutationsList !== "forceGridAnimation") {
            // check if we care about the mutation
            const relevantMutationHappened = mutationsList.filter((m)=>m.attributeName === "class" || m.addedNodes.length || m.removedNodes.length).length;
            if (!relevantMutationHappened) return;
            if (mutationsDisabled) return;
        }
        const gridBoundingClientRect = container.getBoundingClientRect();
        const childrenElements = Array.from(container.children);
        // stop current transitions and remove transforms on transitioning elements
        childrenElements.filter((el)=>{
            const itemPosition = cachedPositionData[el.dataset[$882b6d93070905b3$var$DATASET_KEY]];
            if (itemPosition && itemPosition.stopTween) {
                itemPosition.stopTween();
                delete itemPosition.stopTween;
                return true;
            }
        }).forEach((el)=>{
            el.style.transform = "";
            const firstChild = el.children[0];
            if (firstChild) firstChild.style.transform = "";
        });
        const animatedGridChildren = childrenElements.map((el)=>({
            childCoords: {},
            el: el,
            boundingClientRect: $882b6d93070905b3$var$getGridAwareBoundingClientRect(gridBoundingClientRect, el)
        })).filter(({ el: el , boundingClientRect: boundingClientRect  })=>{
            const itemPosition = cachedPositionData[el.dataset[$882b6d93070905b3$var$DATASET_KEY]];
            // don't animate the initial appearance of elements,
            // just cache their position so they can be animated later
            if (!itemPosition) {
                recordPositions([
                    el
                ]);
                return false;
            } else if (boundingClientRect.top === itemPosition.rect.top && boundingClientRect.left === itemPosition.rect.left && boundingClientRect.width === itemPosition.rect.width && boundingClientRect.height === itemPosition.rect.height) // if it hasn't moved, dont animate it
                return false;
            return true;
        });
        // having more than one child in the animated item is not supported
        animatedGridChildren.forEach(({ el: el  })=>{
            if (Array.from(el.children).length > 1) throw new Error("Make sure every grid item has a single container element surrounding its children");
        });
        if (!animatedGridChildren.length) return;
        const animatedElements = animatedGridChildren.map(({ el: el  })=>el);
        disableMutationsWhileFunctionRuns(()=>onStart(animatedElements));
        const completionPromises = [];
        animatedGridChildren// do this measurement first so as not to cause layout thrashing
            .map((data)=>{
                const firstChild = data.el.children[0];
                // different transform origins give different effects. "50% 50%" is default
                if (firstChild) data.childCoords = $882b6d93070905b3$var$getGridAwareBoundingClientRect(gridBoundingClientRect, firstChild);
                return data;
            }).forEach(({ el: el , boundingClientRect: { top: top , left: left , width: width , height: height  } , childCoords: { top: childTop , left: childLeft  }  }, i)=>{
            const firstChild = el.children[0];
            const itemPosition = cachedPositionData[el.dataset[$882b6d93070905b3$var$DATASET_KEY]];
            const coords = {
                scaleX: itemPosition.rect.width / width,
                scaleY: itemPosition.rect.height / height,
                translateX: itemPosition.rect.left - left,
                translateY: itemPosition.rect.top - top
            };
            el.style.transformOrigin = "0 0";
            if (firstChild && childLeft === left && childTop === top) firstChild.style.transformOrigin = "0 0";
            let cachedResolve;
            const completionPromise = new Promise((resolve)=>{
                cachedResolve = resolve;
            });
            completionPromises.push(completionPromise);
            $882b6d93070905b3$var$applyCoordTransform(el, coords, {
                immediate: true
            });
            // now start the animation
            const startAnimation = ()=>{
                const { stop: stop  } = (0, $8zHUo$popmotion.tween)({
                    from: coords,
                    to: {
                        translateX: 0,
                        translateY: 0,
                        scaleX: 1,
                        scaleY: 1
                    },
                    duration: duration,
                    ease: $882b6d93070905b3$var$popmotionEasing[easing]
                }).start({
                    update: (transforms)=>{
                        $882b6d93070905b3$var$applyCoordTransform(el, transforms);
                        // this helps prevent layout thrashing
                        (0, ($parcel$interopDefault($8zHUo$framesync))).postRender(()=>recordPositions([
                            el
                        ]));
                    },
                    complete: cachedResolve
                });
                itemPosition.stopTween = stop;
            };
            if (typeof stagger !== "number") startAnimation();
            else {
                const timeoutId = setTimeout(()=>{
                    (0, ($parcel$interopDefault($8zHUo$framesync))).update(startAnimation);
                }, stagger * i);
                itemPosition.stopTween = ()=>clearTimeout(timeoutId);
            }
        });
        Promise.all(completionPromises).then(()=>{
            onEnd(animatedElements);
        });
    };
    const observer = new MutationObserver(mutationCallback);
    observer.observe(container, {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: [
            "class"
        ]
    });
    const unwrapGrid = ()=>{
        window.removeEventListener("resize", throttledResizeListener);
        container.removeEventListener("scroll", throttledScrollListener);
        observer.disconnect();
    };
    const forceGridAnimation = ()=>mutationCallback("forceGridAnimation");
    return {
        unwrapGrid: unwrapGrid,
        forceGridAnimation: forceGridAnimation
    };
};


//# sourceMappingURL=main.js.map
