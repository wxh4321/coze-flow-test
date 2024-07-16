import { defineComponent as _, inject as k, computed as d, openBlock as y, createBlock as $, Teleport as B, unref as u, createElementBlock as T, mergeProps as V, renderSlot as A, createCommentVNode as C } from "vue";
import { Position as p, NodeIdInjection as O, useVueFlow as P, getRectOfNodes as S } from "@vue-flow/core";
const j = {
  name: "NodeToolbar",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, D = /* @__PURE__ */ _({
  ...j,
  props: {
    nodeId: null,
    isVisible: { type: Boolean },
    position: { default: p.Top },
    offset: { default: 10 },
    align: { default: "center" }
  },
  setup(g) {
    const t = g, m = k(O, null), { viewportRef: c, viewport: b, getSelectedNodes: v, findNode: f } = P();
    function x(e, o, r, i, h) {
      let l = 0.5;
      h === "start" ? l = 0 : h === "end" && (l = 1);
      let n = [
        (e.x + e.width * l) * o.zoom + o.x,
        e.y * o.zoom + o.y - i
      ], a = [-100 * l, -100];
      switch (r) {
        case p.Right:
          n = [
            (e.x + e.width) * o.zoom + o.x + i,
            (e.y + e.height * l) * o.zoom + o.y
          ], a = [0, -100 * l];
          break;
        case p.Bottom:
          n[1] = (e.y + e.height) * o.zoom + o.y + i, a[1] = 0;
          break;
        case p.Left:
          n = [
            e.x * o.zoom + o.x - i,
            (e.y + e.height * l) * o.zoom + o.y
          ], a = [-100, -100 * l];
          break;
      }
      return `translate(${n[0]}px, ${n[1]}px) translate(${a[0]}%, ${a[1]}%)`;
    }
    const s = d(() => (Array.isArray(t.nodeId) ? t.nodeId : [t.nodeId || m || ""]).reduce((o, r) => {
      const i = f(r);
      return i && o.push(i), o;
    }, [])), I = d(
      () => typeof t.isVisible == "boolean" ? t.isVisible : s.value.length === 1 && s.value[0].selected && v.value.length === 1
    ), z = d(() => S(s.value)), w = d(() => Math.max(...s.value.map((e) => (e.computedPosition.z || 1) + 1))), N = d(() => ({
      position: "absolute",
      transform: x(z.value, b.value, t.position, t.offset, t.align),
      zIndex: w.value
    }));
    return (e, o) => (y(), $(B, {
      to: u(c),
      disabled: !u(c)
    }, [
      u(I) && u(s).length ? (y(), T("div", V({ key: 0 }, e.$attrs, {
        style: u(N),
        class: "vue-flow__node-toolbar"
      }), [
        A(e.$slots, "default")
      ], 16)) : C("", !0)
    ], 8, ["to", "disabled"]));
  }
});
export {
  D as NodeToolbar
};
