class CommercialItem extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });
		const commercialItemStyles = `:host {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px;
                padding: 20px;
                border: 1px solid #000;
                border-radius: 10px;
            }
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
        `;
		const style = document.createElement("style");
		style.innerHTML = commercialItemStyles;
		this.shadowRoot.appendChild(style);
	}
}
