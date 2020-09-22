console.log(findNodeById(441));

/**
 * 遍历 tree ，查找节点
 * originData.entity 是root 节点的子节点列表
 * @param id 关键字
 * @returns {res  or  null}
 */
function findNodeById(id) {
    let t = originData.entity, res = null;
    for (let i = 0; i < t.length; i++) {
        res = indexOfTree(t[i], id)
        if (res != null) return res;
    }
    return res;
}

function indexOfTree(node, id) {
    if (node.id == id) return node;
    let t = node.children, res = null;
    if (t != null && t.length > 0) {
        for (let i = 0; i < t.length; i++) {
            console.log(t[i].id, t[i].name);
            res = indexOfTree(t[i], id)
            if (res != null) return res;
        }
    }
    return res;
}
