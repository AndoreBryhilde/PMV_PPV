function pmv(rh, w, m, tr, icl, v, ta) {
    let pmv1, pmv2, tcl, b, c, d, e, con
    let factor = 500;
    let s = 0;

    let pa = (rh / 100) * 0.1333 * Math.exp(18.6686 - 4030.183 / (ta + 235));
    let rcl = 0.155 * icl;
    let fcl = 1.05 + 0.65 * rcl;
    let hc = 12.1 * Math.pow(v, 0.5);

    do {
        b = 3.05 * (0.255 * (35.7 - 0.0285 * m) - 3.36 - pa);
        c = 0.42 * ((m - w) - 58);
        d = 1.73E-2 * m * (5.867 - pa);
        e = 1.4E-3 * m * (34 - ta);
        tcl = 35.7 - 0.0275 * m - rcl * (m - w - b - c - d - e - s);
        pmv1 = 5.67E-8 * 0.95 * 0.77 * fcl * (Math.pow((tcl + 273), 4) - Math.pow((tr + 273), 4));
        pmv2 = fcl * hc * (tcl - ta);
        con = m - w - b - c - d - e - pmv1 - pmv2 - s;
        if (con > 0) {
            s = s + factor;
            factor = factor / 2;
        }
        else {
            s = s - factor;
        }
    } while (Math.abs(con) > 0.0001); s

    return (0.303 * Math.exp(-0.036 * m) + 0.028) * ((m - w) - pmv1 - pmv2 - b - c - d - e);

}

function ppd(pmv) {
    return 100 - 95 * Math.exp(-0.03353 * Math.pow(pmv, 4) - 0.2179 * Math.pow(pmv, 2));
}

function golden(rh, m, w, tr, icl, v) {
    let x, f, fx;

    let r = (Math.pow(5, 0.5) - 1) / 2;
    let xl = 16;
    let xu = 30;
    let i = 0;
    let d = r * (xu - xl);
    let x1 = xl + d;
    let x2 = xu - d;
    let pmv1 = pmv(rh, w, m, tr, icl, v, x1);
    let f1 = ppd(pmv1);
    let pmv2 = pmv(rh, w, m, tr, icl, v, x2);
    let f2 = ppd(pmv2);

    if (f1 > f2) {
        x = x1
        f = f1
    }
    else {
        x = x2
        f = f2
    }
    while (i < 50) {
        d = r * d
        if (f1 < f2) {
            xl = x2
            x2 = x1
            x1 = xl + d
            f2 = f1
            pmv1 = pmv(rh, w, m, tr, icl, v, x1)
            f1 = ppd(pmv1)
        } else {
            xu = x1
            x1 = x2
            x2 = xu - d
            f1 = f2
            pmv2 = pmv(rh, w, m, tr, icl, v, x2)
            f2 = ppd(pmv2)
        }
        i = i + 1
        if (f1 < f2) {
            x = x1
            fx = f1
        } else {
            x = x2
            fx = f2
        }

    }

    let ta = Math.round(x)
    let pmv_value = pmv(rh, w, m, tr, icl, v, ta)

    return { 'ta': ta, 'pmv': pmv_value };
}

const calculate = {
    data() {
        return {
            m: 70,
            w: 0,
            tr: 22,
            icl: 1,
            v: 0.1,
            rh: 50,
            ta: '',
            pmv_c: '',
            ppd_c: ''
        }
    },
    methods: {
        calculator1() {
            let ans = golden(this.rh, this.m, this.w, this.tr, this.icl, this.v);
            this.ta = ans['ta'];
            this.pmv_c = ans['pmv'];
            this.ppd_c = ppd(ans['pmv']);
        }
    }
}

Vue.createApp(calculate).mount('#theme')