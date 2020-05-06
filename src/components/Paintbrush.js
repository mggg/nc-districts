import React from 'react'

function addNewColorButton(colors, onInput) {
    const nextColor = colors.find(color => color.visible === false);
    const onClick = () => {
        nextColor.visible = true;
        onInput({ target: { value: nextColor.id } });
    };
    if (!nextColor) {
        return "";
    }
    return <button
        className="icon-list__item subtle-button"
        onClick={onClick}
        title="Add another color"
    >
        <i className="material-icons">
            add
        </i>
    </button>
}

export default function Paintbrush(props) {
  let colors = [{color:"#f00", visible:true,displayNumber:1,id:0},
    {color:"#00f", visible:true,displayNumber:2,id:1}]

  return <div className="ui-option">
        <ol className="icon-list color-list">
            {colors.filter(color => color.visible)
                  .map((color, k) =>
                    <li
                        className="icon-list__item color-list__item"
                        title={color.displayNumber}
                        key={k}
                    >
                        <input
                            type="radio"
                            id={"brush-color__" + color.id}
                            name="brush-color"
                            value={color.id}
                            checked={true}
                            onChange={null}
                        />
                        <div
                            className="icon-list__item__radio"
                            style={{background: color.color}}
                        ></div>
                    </li>
            )}
            {addNewColorButton(colors, () => {})}
        </ol>
    </div>
}
