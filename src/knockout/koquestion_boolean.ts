import * as ko from "knockout";
import { CssClassBuilder } from "src/utils/cssClassBuilder";
import { QuestionBooleanModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionBoolean extends QuestionBooleanModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  private get allowClick() {
    return this.isIndeterminate && !this.isInputReadOnly;
  }
  public getItemCss(row: any, column: any) {
    const isChecked = this.checkedValue;
    const isDisabled = this.isReadOnly;
    const cssClasses = this.cssClasses;
    return new CssClassBuilder()
      .append(cssClasses.item)
      .append(cssClasses.itemDisabled, isDisabled)
      .append(cssClasses.itemChecked, isChecked)
      .append(cssClasses.itemIndeterminate, isChecked === null)
      .toString();
  }
  public getCheckedLabelCss(): string {
    return this.getLabelClass(true);
  }
  public getUncheckedLabelCss(): string {
    return this.getLabelClass(false);
  }
  private getLabelClass(checked: boolean): string {
    const question: QuestionBooleanModel = this;
    return new CssClassBuilder()
      .append(question.cssClasses.label)
      .append(question.cssClasses.disabledLabel,
        question.checkedValue === !checked || question.isReadOnly)
      .toString();
  }
  private preventDefaults(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  private onLabelClick(event: any, value: boolean) {
    if (this.allowClick) {
      this.preventDefaults(event);
      this.checkedValue = value;
    }
    return true;
  }
  public onSwitchClick(data: any, event: any) {
    if (this.allowClick) {
      this.preventDefaults(event);
      var isRightClick = event.offsetX / event.target.offsetWidth > 0.5;
      var isRtl =
        document.defaultView.getComputedStyle(event.target).direction == "rtl";

      this.checkedValue = isRtl ? !isRightClick : isRightClick;
      return;
    }
    return true;
  }
  public onTrueLabelClick(data: any, event: any) {
    return this.onLabelClick(event, true);
  }
  public onFalseLabelClick(data: any, event: any) {
    return this.onLabelClick(event, false);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}
Serializer.overrideClassCreator("boolean", function() {
  return new QuestionBoolean("");
});

QuestionFactory.Instance.registerQuestion("boolean", (name) => {
  return new QuestionBoolean(name);
});
