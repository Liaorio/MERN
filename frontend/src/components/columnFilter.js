import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class ColumnFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      maxFilterWord: "",
      minFilterWord: "",
      conditionValue: "",
      logicValue: false,
      expanded: false,
      availableValuesArray: []
    };
    this.style = {
      container: {
        padding: 5
      },
      item: {
        height: 24,
        marginBottom: 5
      }
    };
    this.conditionType = {
      initialCondition: "initial",

      dateCondition: {
        At: "At",
        After: "After",
        Before: "Before",
        Empty: "Empty"
      },

      numberCondition: {
        Equals: "Equals",
        MoreThan: "More Than",
        LessThan: "Less Than",
        Between: "Between",
        Empty: "Empty"
      },

      boolCondition: {
        true: "true",
        false: "false"
      },

      stringCondition: {
        Equals: "Equals",
        StartWith: "Start With",
        EndWith: "End With",
        Contains: "Contains",
        Empty: "Empty",
        Values: "Equals Optional Values"
      },

      singleSelectCondition: {
        Empty: "Empty",
        Values: "Equals Optional Values"
      }
    };
    this.valueType = {
      string: "string",
      number: "number",
      date: "date",
      bool: "bool"
    };
    this.valueGetter = this.props.valueGetter;
    this.onSingleFilterValueChange = this.onSingleFilterValueChange.bind(this);
    //this.onMaxFilterValueChange = this.onMaxFilterValueChange.bind(this);
    //this.onMinFilterValueChange = this.onMinFilterValueChange.bind(this);
    this.onMultipleFilterValueChange = this.onMultipleFilterValueChange.bind(
      this
    );
    this.getMultipleSelectionOptionsDOM = this.getMultipleSelectionOptionsDOM.bind(
      this
    );
    this.onLogicValueChange = this.onLogicValueChange.bind(this);
  }

  isFilterActive() {
    return (
      (this.state.filterValue && this.state.filterValue !== "") ||
      (this.state.maxFilterWord && this.state.maxFilterWord !== "") ||
      (this.state.minFilterWord && this.state.minFilterWord !== "")
    );
  }

  getModel() {
    return {
      value: this.state.filterValue
    };
  }

  setModel(model) {
    this.setState({
      filterValue: model ? model.value : "",
      maxFilterWord: model ? model.value : "",
      minFilterWord: model ? model.value : ""
    });
  }

  afterGuiAttached(params) {
    this.focus();
    let availableValuesArray = this.getAvailableFilterValues();
    this.setState({
      availableValuesArray: availableValuesArray
    });
  }

  focus() {
    setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.input);
      if (container) {
        container.focus();
      }
    });
  }

  doesFilterPass(params) {
    let filterValue =
      this.valueGetter(params.node).value == null
        ? ""
        : this.valueGetter(params.node).value;
    filterValue =
      typeof filterValue === this.valueType.string
        ? filterValue.toLowerCase()
        : filterValue;

    let filterWord, filterArray;
    if (Array.isArray(this.state.filterValue)) {
      filterArray = this.state.filterValue;
    } else {
      filterWord = this.state.filterValue.toLowerCase();
    }
    let ret = this.filterString(
      filterValue,
      filterWord,
      filterArray,
      this.state.conditionValue
    );

    return this.state.logicValue ? !ret : ret;
  }

  filterString(filterValue, filterWord, filterArray, conditionType) {
    let _filterValue = filterValue.toString();
    switch (conditionType) {
      case this.conditionType.stringCondition.Contains:
        return _filterValue.indexOf(filterWord) >= 0;
      case this.conditionType.stringCondition.StartWith:
        return _filterValue.startsWith(filterWord);
      case this.conditionType.stringCondition.EndWith:
        return _filterValue.endsWith(filterWord);
      case this.conditionType.stringCondition.Equals:
        return _filterValue === filterWord;
      case this.conditionType.stringCondition.Empty:
        return _filterValue == null || _filterValue === "";
      case this.conditionType.stringCondition.Values:
        if (!filterArray || filterArray.length === 0) return true;
        let _filterArr = filterArray.map(item => item.toString().toLowerCase());
        return _filterArr.indexOf(_filterValue) >= 0;
      default:
        return true;
    }
  }

  onConditionChange(event) {
    let newValue = event.target.value;
    if (this.state.conditionValue !== newValue) {
      // Other condition => Initial
      if (newValue === this.conditionType.initialCondition) {
        this.setState({
          filterValue: ""
        });
      }

      // Empty or Values => Other condition
      if (
        this.state.conditionValue.toString() ===
          this.conditionType.stringCondition.Values ||
        this.state.conditionValue.toString() ===
          this.conditionType.stringCondition.Empty ||
        this.state.conditionValue.toString() ===
          this.conditionType.dateCondition.Empty ||
        this.state.conditionValue.toString() ===
          this.conditionType.numberCondition.Empty
      ) {
        this.setState({
          filterValue: ""
        });
      }

      // Other condition => Empty
      if (
        newValue === this.conditionType.stringCondition.Empty ||
        newValue === this.conditionType.dateCondition.Empty ||
        newValue === this.conditionType.numberCondition.Empty
      ) {
        this.onSingleFilterValueChange(event);
      }

      // Boolean value filters
      if (
        newValue === this.conditionType.boolCondition.true ||
        newValue === this.conditionType.boolCondition.false
      ) {
        this.onSingleFilterValueChange(event);
      }

      this.setState(
        {
          conditionValue: newValue
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  onLogicValueChange(event) {
    let newValue = event.target.checked;
    if (this.state.logicValue !== newValue) {
      this.setState(
        {
          logicValue: newValue
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  onSingleFilterValueChange(event) {
    let newValue = event.target.value;
    if (this.state.filterValue !== newValue) {
      this.setState(
        {
          filterValue: newValue
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  onMultipleFilterValueChange(event) {
    let filterArray = Array.isArray(this.state.filterValue)
      ? this.state.filterValue
      : [];
    let val = event.target.name;
    let index = filterArray.indexOf(val);
    if (index > -1) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(val);
    }
    this.setState(
      {
        filterValue: filterArray
      },
      () => {
        this.props.filterChangedCallback();
      }
    );
  }

  getSingleSelectionOptionsDOM(item, index) {
    return (
      <option key={index} value={item}>
        {item}
      </option>
    );
  }

  getMultipleSelectionOptionsDOM(item, index) {
    let isChecked = Array.isArray(this.state.filterValue)
      ? this.state.filterValue.includes(item.toString())
      : false;
    return (
      <label htmlFor={item} key={index}>
        <input
          id={item}
          name={item}
          type="checkbox"
          onChange={this.onMultipleFilterValueChange}
          checked={isChecked}
        />
        {item}
      </label>
    );
  }

  uniqueAppend(target, source) {
    if (source != null) {
      source.forEach(x => {
        if (!target.includes(x)) {
          target.push(x);
        }
      });
    }
  }

  getAvailableFilterValues() {
    let field = this.props.colDef.field;
    let tmpArr1 = [];
    this.props.api.forEachNodeAfterFilter(node => {
      if (node.data && node.data[field] && node.data[field].value !== null) {
        tmpArr1.push(node.data[field].value);
      }
    });
    let tmpArr2 = [];
    this.uniqueAppend(tmpArr2, tmpArr1.sort());
    return tmpArr2;
  }

  showCheckbox() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  generateMultipleSelect(valueSelections) {
    let displayStyle = this.state.expanded ? "block" : "none";
    let multipleSelections =
      valueSelections.length > 0 ? (
        valueSelections.map(this.getMultipleSelectionOptionsDOM)
      ) : (
        <span>No values</span>
      );
    return (
      <span className="multiSelect">
        <div className="selectBox" onClick={() => this.showCheckbox()}>
          <select>
            <option>- Select values -</option>
          </select>
          <div className="overSelect"> </div>
        </div>
        <div id="checkboxes" style={{ display: displayStyle }}>
          {multipleSelections}
        </div>
      </span>
    );
  }

  generateNotLogicCheckbox() {
    return (
      <label style={{ display: "inline" }}>
        NOT
        <input
          type="checkbox"
          onChange={this.onLogicValueChange}
          checked={this.state.logicValue}
        />
      </label>
    );
  }

  generateConditionFilter() {
    let conditionSelections = Object.values(
      this.conditionType.stringCondition
    ).map(this.getSingleSelectionOptionsDOM);
    let logicCheckbox = this.generateNotLogicCheckbox();
    return (
      <div>
        Condition:&nbsp;&nbsp;
        {logicCheckbox}
        <select
          style={this.style.item}
          onChange={e => this.onConditionChange(e)}
          value={this.state.conditionValue}
        >
          <option value={this.conditionType.initialCondition}>
            - Select Condition -
          </option>
          {conditionSelections}
        </select>
      </div>
    );
  }

  generateFilter() {
    let conditionSelectionsDOM = this.generateConditionFilter();
    let availableFilterValues = this.state.availableValuesArray;
    let multipleSelection = this.generateMultipleSelect(availableFilterValues);
    switch (this.state.conditionValue) {
      case "":
      case this.conditionType.stringCondition.Empty:
      case this.conditionType.singleSelectCondition.Empty:
        return <div style={this.style.container}>{conditionSelectionsDOM}</div>;

      case this.conditionType.stringCondition.Values:
      case this.conditionType.singleSelectCondition.Values:
        return (
          <div style={this.style.container}>
            {conditionSelectionsDOM}
            {multipleSelection}
          </div>
        );

      default:
        return (
          <div style={this.style.container}>
            {conditionSelectionsDOM}
            Value:&nbsp;&nbsp;
            <input
              ref="input"
              value={this.state.filterValue}
              onChange={this.onSingleFilterValueChange}
            />
          </div>
        );
    }
  }

  render() {
    return <span>{this.generateFilter()}</span>;
  }
}
