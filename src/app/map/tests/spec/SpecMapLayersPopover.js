// require([
//     'app/map/MapLayersPopover',

//     'dojo/_base/window',

//     'dojo/dom-construct'
// ], function(
//     WidgetUnderTest,

//     win,

//     domConstruct
// ) {

//     var widget;

//     afterEach(function() {
//         if (widget) {
//             widget.destroyRecursive();
//             widget = null;
//         }
//     });

//     describe('app/map/MapLayersPopover', function() {
//         describe('Sanity', function() {
//             beforeEach(function() {
//                 widget = new WidgetUnderTest(null, domConstruct.create('div', null, win.body()));
//             });

//             it('should create a MapLayersPopover', function() {
//                 expect(widget).toEqual(jasmine.any(WidgetUnderTest));
//             });
//         });
//     });
// });