import {
  CSSType,
  marginBottomProperty,
  marginLeftProperty,
  marginRightProperty,
  marginTopProperty,
  paddingBottomProperty,
  paddingLeftProperty,
  paddingRightProperty,
  paddingTopProperty,
  profile,
  View as NSView
} from '@nativescript/core';
import {
  alignSelfProperty,
  FlexAlignItems, FlexAlignSelf, flexBasisProperty,
  FlexDirection, flexDirectionProperty, flexGrowProperty,
  FlexJustify, flexProperty, flexShrinkProperty,
  FlexWrap,
  Overflow,
  Position,
  ViewBase,
  alignContentProperty, aspectRatioProperty,
  Direction
} from './common';
import {layout} from "@nativescript/core/utils";

export {
  FlexDirection,
  FlexAlignItems,
  FlexAlignSelf,
  FlexWrap,
  FlexJustify,
  Overflow,
  Position,
  Direction
} from './common';


@CSSType('View')
export class View extends ViewBase {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
	nativeView: com.facebook.yoga.android.YogaLayout;
  _yogaNode: com.facebook.yoga.YogaNode;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get yogaNode(): com.facebook.yoga.YogaNode {
    if (!this._yogaNode) {
      if (this.nativeView) {
        this._yogaNode = this.nativeView.getYogaNode();
      }
    }
    return this._yogaNode;
  }

  _children: NSView[] = [];
  _childrenQueue: NSView[] = [];
  private static _didInit = false;

  constructor() {
    super();
  }

  @profile
  createNativeView() {
    let nativeView;
    if (!View._didInit) {
      nativeView = io.github.triniwiz.yogalayout.Utils.createLayout(this._context, true, true);
      View._didInit = true;
    } else {
      nativeView = io.github.triniwiz.yogalayout.Utils.createLayout(this._context, false, true);
    }

    return nativeView;
  }

  @profile
  initNativeView() {
    this._init();
    super.initNativeView();
  }

  _isSingle(value: string) {
    if (typeof value === 'string') {
      return value.split(' ').length > 1;
    }
    return true;
  }

  _init() {
    const json = {};
    this._updateWidth(this.style.width, false, json);
    this._updateHeight(this.style.height, false, json);
    this._updateMinWidth(this.style.minWidth, false, json);
    this._updateMinHeight(this.style.minHeight, false, json);
    this._updateMaxWidth(this.style.maxWidth, false, json);
    this._updateMaxHeight(this.style.maxHeight, false, json);
    this._updateAlignItems(this.style.alignItems as any, false, json);
    this._updateOverflow(this.style.overflow as any, false, json);
    this._updatePosition(this.style.position, false, json);
    this._updateLeft(this.style.left, false, json);
    this._updateTop(this.style.top, false, json);
    this._updateRight(this.style.right, false, json);
    this._updateBottom(this.style.bottom, false, json);
    if (this._isSingle(this.style.padding as any)) {
      this._updatePadding(this.style.padding, false, json);
    } else {
      this._updatePaddingLeft(this.style.paddingLeft, false, json);
      this._updatePaddingTop(this.style.paddingTop, false, json);
      this._updatePaddingRight(this.style.paddingRight, false, json);
      this._updatePaddingBottom(this.style.paddingBottom, false, json);
    }

    if (this._isSingle(this.style.margin as any)) {
      this._updateMargin(this.style.margin, false, json);
    } else {
      this._updateMarginLeft(this.style.marginLeft, false, json);
      this._updateMarginTop(this.style.marginTop, false, json);
      this._updateMarginRight(this.style.marginRight, false, json);
      this._updateMarginBottom(this.style.marginBottom, false, json);
    }


    this._updateJustifyContent(this.style.justifyContent, false, json);
    this._updateFlexWrap(this.style.flexWrap, false, json);
    this._updateFlex(this.style.flex, false, json);
    this._updateFlexDirection(this.style.flexDirection, false, json);
    this._updateAlignSelf(this.style.alignSelf, false, json);

    this._updateFlexGrow(this.style.flexGrow, false, json);
    this._updateFlexShrink(this.style.flexShrink, false, json);
    this._updateFlexBasis(this.style.flexBasis, false, json);
    this._updateAlignContent(this.style.alignContent, false, json);

    this._updateAspectRatio(this.aspectRatio, false, json);
    this._updateDirection(this.style.direction, false, json);
    this._updateStart(this.style.start, false, json);
    this._updateEnd(this.style.end, false, json);
    const data = JSON.stringify(json);
    io.github.triniwiz.yogalayout.Utils.batch(data, this.nativeView);
  }

  private _childrenBatchProperties = [];
  private _childrenBatchViews = [];

  private _processBatch() {
    if (this._children.length && this._childrenBatchProperties.length && this._childrenBatchViews.length) {
      io.github.triniwiz.yogalayout.Utils.batchChildren(JSON.stringify(this._childrenBatchProperties), this.nativeView, this._childrenBatchViews);
      this._childrenBatchViews.splice(0);
      this._childrenBatchProperties.splice(0);
    }
  }


  @profile
  onLoaded() {
    super.onLoaded();
    this._children.forEach((child) => {
      this._addChild(child, false, true);
    });
    this._childrenQueue.forEach((child) => {
      this._addChild(child, true, true);
    });
    if (this._childrenQueue.length) {
      this._childrenQueue.splice(0);
    }
    this._processBatch();
  }


  disposeNativeView() {
    this._children.forEach(view => {
      this._removePropertyChangeHandler(view);
      this._removeView(view);
    });
    this._children.splice(0);
    super.disposeNativeView();
  }

  _addChildFromBuilder(name: string, value: any): void {
    if (value.parent !== this) {
      this._children.push(value);
    }
  }


  public eachChild(callback: (child: View) => boolean): void {
    this._children.forEach((view, key) => {
      callback(view as any);
    });
  }

  public eachChildView(callback: (child: View) => boolean): void {
    this._children.forEach((view, key) => {
      callback(view as any);
    });
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get android() {
    return this.nativeView;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get yoga() {
    return this.nativeView;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set width(value) {
    this.style.width = value;
    this._updateWidth(value);
  }

  get width() {
    if (!this.nativeView) {
      return this.style.width;
    }

    if (this.style.width === 'auto') {
      return 'auto';
    }
    return this.yogaNode.getWidth().value;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set height(value) {
    this.style.height = value;
    this._updateHeight(value);
  }

  get height() {
    if (!this.nativeView) {
      return this.style.height;
    }
    if (this.style.height === 'auto') {
      return 'auto';
    }
    return this.yogaNode.getHeight().value;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set left(value) {
    this.style.left = value;
    this._updateLeft(value);
  }

  get left() {
    if (!this.nativeView) {
      return this.style.left;
    }
    return this._getPositionValue("left");
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set top(value) {
    this.style.top = value;
    this._updateTop(value);
  }

  get top() {
    if (!this.nativeView) {
      return this.style.top;
    }
    return this._getPositionValue("top");
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set right(value) {
    this.style.right = value;
    this._updateRight(value);
  }

  get right() {
    if (!this.nativeView) {
      return this.style.right;
    }
    return this._getPositionValue("right");
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set bottom(value) {
    this.style.bottom = value;
    this._updateBottom(value);
  }

  get bottom() {
    if (!this.nativeView) {
      return this.style.bottom;
    }
    return this._getPositionValue("bottom");
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set minWidth(value) {
    this.style.minWidth = value;
    this._updateMinWidth(value);
  }


  get minWidth() {
    return this.style.minWidth;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set maxWidth(value) {
    this.style.maxWidth = value;
    this._updateMaxWidth(value);
  }


  get maxWidth() {
    return this.style.maxWidth;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set maxHeight(value) {
    this.style.maxHeight = value;
    this._updateMaxHeight(value);
  }


  get maxHeight() {
    return this.style.maxHeight;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set alignItems(value) {
    this.style.alignItems = value;
    this._updateAlignItems(value);
  }

  get alignItems() {
    return this.style.alignItems as FlexAlignItems;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set overflow(value) {
    this.style.overflow = value;
    this._updateOverflow(value);
  }

  get overflow() {
    return this.style.overflow;
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set position(value) {
    this.style.position = value;
    this._updatePosition(value);
  }

  get position() {
    return this.style.position;
  }

  set padding(value) {
    this.style.padding = value;
  }

  [paddingTopProperty.setNative](value) {
    this._updatePaddingTop(value);
  }

  [paddingRightProperty.setNative](value) {
    this._updatePaddingRight(value);
  }

  [paddingBottomProperty.setNative](value) {
    this._updatePaddingBottom(value);
  }

  [paddingLeftProperty.setNative](value) {
    this._updatePaddingLeft(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  set margin(value) {
    this.style.margin = value;
  }

  [marginTopProperty.setNative](value) {
    this._updateMarginTop(value);
  }

  [marginRightProperty.setNative](value) {
    this._updateMarginRight(value);
  }

  [marginBottomProperty.setNative](value) {
    this._updateMarginBottom(value);
  }

  [marginLeftProperty.setNative](value) {
    this._updateMarginLeft(value);
  }

  set justifyContent(value) {
    this.style.justifyContent = value;
    this._updateJustifyContent(value);
  }

  get justifyContent() {
    return this.style.justifyContent;
  }

  set flexWrap(value) {
    this.style.flexWrap = value;
    this._updateFlexWrap(value);
  }

  get flexWrap() {
    return this.style.flexWrap;
  }

  [alignSelfProperty.setNative](value) {
    this._updateAlignSelf(value);
  }

  [flexProperty.setNative](value) {
    this._updateFlex(value);
  }

  [flexGrowProperty.setNative](value) {
    this._updateFlexGrow(value);
  }

  [flexShrinkProperty.setNative](value) {
    this._updateFlexShrink(value);
  }

  [flexBasisProperty.setNative](value) {
    this._updateFlexBasis(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get flexDirection() {
    return this.style.flexDirection as any;
  }

  set flexDirection(value) {
    this.style.flexDirection = value;
    this._updateFlexDirection(value);
  }

  [alignContentProperty.setNative](value) {
    this._updateAlignContent(value);
  }

  [aspectRatioProperty.setNative](value) {
    this._updateAspectRatio(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get start() {
    return this.style.start;
  }

  set start(value) {
    this.style.start = value;
    this._updateStart(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get end() {
    return this.style.end;
  }

  set end(value) {
    this.style.end = value;
    this._updateEnd(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get direction() {
    if (!this.nativeView) {
      return Direction.Inherit;
    }
    return io.github.triniwiz.yogalayout.Utils.getLayoutDirection(this.yogaNode) as any
  }

  set direction(value) {
    this.style.direction = value;
    this._updateDirection(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get marginVertical(): any {
    return this.style.marginVertical;
  }

  set marginVertical(value) {
    this.style.marginVertical = value;
    this._updateMarginVertical(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get marginHorizontal(): any {
    return this.style.marginHorizontal;
  }

  set marginHorizontal(value) {
    this.style.marginHorizontal = value;
    this._updateMarginHorizontal(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get paddingHorizontal() {
    return this.style.paddingHorizontal;
  }

  set paddingHorizontal(value) {
    this.style.paddingHorizontal = value;
    this._updatePaddingHorizontal(value);
  }

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  get paddingVertical() {
    return this.style.paddingVertical;
  }

  set paddingVertical(value) {
    this.style.paddingVertical = value;
    this._updatePaddingVertical(value);
  }

  private _addChild(child: NSView, addToChildren = false, batchingChildren = false) {
    if (!child) {
      return;
    }
    if (child.parent && child.parent !== this) {
      child.parent._removeView(child);
    }

    if (child.parent !== this) {
      const wasAdded = this._children.indexOf(child) !== -1;
      if (!this.nativeView) {
        this._childrenQueue.push(child);
        return;
      }
      if (addToChildren && !wasAdded) {
        this._children.push(child);
      }
      this._addPropertyChangeHandler(child);
      this._addView(child);

      const json = {
        alignSelf: child.style.alignSelf,
        flexGrow: child.style.flexGrow,
        flexShrink: child.style.flexShrink,
        flex: child.style.flex,
        direction: child.style.direction,
        position: child.style.position
      };

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (child.style.minWidth !== 'none') {
        json['minWidth'] = child.style.minWidth;
      }

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (child.style.minHeight !== 'none') {
        json['minHeight'] = child.style.minHeight;
      }
      if (child.style.maxWidth !== 'none') {
        json['maxWidth'] = child.style.maxWidth;
      }
      if (child.style.maxHeight !== 'none') {
        json['maxHeight'] = child.style.maxHeight;
      }

      if (batchingChildren) {
        this._childrenBatchProperties.push(json);
        this._childrenBatchViews.push(child.nativeView);
      } else {

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.nativeView.addView(child.nativeView);

        const data = JSON.stringify(json);
        io.github.triniwiz.yogalayout.Utils.batchChild(data, this.nativeView, child.nativeView);
      }
    }
  }

  addChildren(views: View[]) {
    if (Array.isArray(views)) {
      views.forEach(child => {
        this._addChild(child, true, true);
      });
      this._processBatch();
    }
  }

  addChild(view: NSView) {
    this._addChild(view, true);
  }

  getChildAt(index: number): NSView {
    return this._children[index];
  }

  getChildIndex(view: NSView): number {
    return this._children.indexOf(view);
  }

  getChildrenCount(): number {
    return this._children.length;
  }

  removeAllChildren() {
    this.nativeView?.removeAllViews();
    this._children.forEach(child => {
      this._removeView(child);
    })
    this._children.splice(0);
  }

  removeChild(view: NSView) {
    if (view?.nativeView) {
      const index = this._children.indexOf(view);
      if (index !== -1) {
        this.nativeView.removeView(view.nativeView);
        view.parent._removeView(view);
        this._children.splice(index, 1);
      }
    }
  }

}
