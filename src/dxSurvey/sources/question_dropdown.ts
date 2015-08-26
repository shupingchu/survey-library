﻿// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionDropdown extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "dropdown";
        }
    }
    JsonObject.metaData.addClass("dropdown", [], function () { return new QuestionDropdown(""); }, "selectbase");
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { return new QuestionDropdown(name); });
}