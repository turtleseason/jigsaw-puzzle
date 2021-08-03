import { BUMP, RECESS, FLAT } from './Edges';
import { LEFT, TOP, RIGHT, BOTTOM } from './Sides';


export default class EdgePathDrawer {
    constructor(pieceWidth, pieceHeight, borderSize) {
        this.START = 'START';
        this.templates = this.makeTemplates(pieceWidth, pieceHeight, borderSize);
    }

    makeTemplates(pW, pH, b) {
        const templates = {};

        templates[this.START] = `M ${b} ${pH - b} `;

        templates[BUMP + LEFT] = (w, o, c1, c2) => `V ${(pH + w) / 2}`
            + `C ${b - o} ${pH / 2 + c1} ${0} ${pH / 2 + c2} ${0} ${pH / 2} `
            + `C ${0} ${pH / 2 - c2} ${b - o} ${pH / 2 - c1} ${b} ${(pH - w) / 2} `;
        templates[RECESS + LEFT] = (w, o, c1, c2) => `V ${(pH + w) / 2}`
            + `C ${b + o} ${pH / 2 + c1} ${b * 2} ${pH / 2 + c2} ${b * 2} ${pH / 2} `
            + `C ${b * 2} ${pH / 2 - c2} ${b + o} ${pH / 2 - c1} ${b} ${(pH - w) / 2} `;
        templates[LEFT] = `V ${b} `;

        templates[BUMP + TOP] = (w, o, c1, c2) => `H ${(pW - w) / 2} `
            + `C ${pW / 2 - c1} ${b - o} ${pW / 2 - c2} ${0} ${pW / 2} ${0} `
            + `C ${pW / 2 + c2} ${0} ${pW / 2 + c1} ${b - o} ${(pW + w) / 2} ${b} `;
        templates[RECESS + TOP] = (w, o, c1, c2) => `H ${(pW - w) / 2} `
            + `C ${pW / 2 - c1} ${b + o}  ${pW / 2 - c2} ${b * 2} ${pW / 2} ${b * 2} `
            + `C ${pW / 2 + c2} ${b * 2} ${pW / 2 + c1} ${b + o} ${(pW + w) / 2} ${b} `;
        templates[TOP] = `H ${pW - b} `;

        templates[BUMP + RIGHT] = (w, o, c1, c2) => `V ${(pH - w) / 2} `
            + `C ${pW - b + o} ${pH / 2 - c1} ${pW} ${pH / 2 - c2} ${pW} ${pH / 2} `
            + `C ${pW} ${pH / 2 + c2} ${pW - b + o} ${pH / 2 + c1} ${pW - b} ${(pH + w) / 2} `;
        templates[RECESS + RIGHT] = (w, o, c1, c2) => `V ${(pH - w) / 2} `
            + `C ${pW - b - o} ${pH / 2 - c1} ${pW - b * 2} ${pH / 2 - c2} ${pW - b * 2} ${pH / 2} `
            + `C ${pW - b * 2} ${pH / 2 + c2} ${pW - b - o} ${pH / 2 + c1} ${pW - b} ${(pH + w) / 2} `;
        templates[RIGHT] = `V ${pH - b} `;

        templates[BUMP + BOTTOM] = (w, o, c1, c2) => `H ${(pW + w) / 2} `
            + `C ${pW / 2 + c1} ${pH - b + o} ${pW / 2 + c2} ${pH} ${pW / 2} ${pH} `
            + `C ${pW / 2 - c2} ${pH} ${pW / 2 - c1} ${pH - b + o} ${(pW - w) / 2} ${pH - b} `;
        templates[RECESS + BOTTOM] = (w, o, c1, c2) => `H ${(pW + w) / 2} `
            + `C ${pW / 2 + c1} ${pH - b - o}  ${pW / 2 + c2} ${pH - b * 2} ${pW / 2} ${pH - b * 2} `
            + `C ${pW / 2 - c2} ${pH - b * 2} ${pW / 2 - c1} ${pH - b - o} ${(pW - w) / 2} ${pH - b} `;
        templates[BOTTOM] = `Z`;

        return templates;
    }

    getPathString(side, edgeStyleInfo) {
        const start = (side === LEFT) ? this.templates[this.START] : '';
        const end = this.templates[side];

        let mid = '';
        if (edgeStyleInfo.type !== FLAT) {
            const key = edgeStyleInfo.type + side;
            mid = this.templates[key](edgeStyleInfo.w, edgeStyleInfo.o, edgeStyleInfo.c1, edgeStyleInfo.c2);
        }

        return start + mid + end;
    }
}