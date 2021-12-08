
/**
 * 
 */
class EvaluateExp {
    constructor(expStr, modifyCb) {
        var self = this;
        var m_expStr = expStr;
        var f;
        var simplified;
        this.error = false;
        var self = this;

        var expandDefines = function (m_expStr) {
            return m_expStr;
        }

        if (modifyCb)
            expandDefines = modifyCb;

        function init() {
            var expanded = expandDefines(m_expStr);
            try {
                simplified = math.parse(expanded);
                if (!m_expStr.includes("log")) simplified = math.simplify(simplified);
            } catch (err) {
                var charPos = parseInt(err.message.match(/(\d+)/)[0]);
                alert("Invalid character in function: " + expanded[charPos - 1]);
                self.error = true;
                return;
            }
            simplified = simplified.compile();
        }

        if (m_expStr !== undefined && m_expStr.length > 0) {
            m_expStr = Utility.logBaseAdjust(m_expStr);
            init();
        }

        this.setExpString = function (s) {
            m_expStr = s;
            init();
        };

        this.getExpString = function () {
            return m_expStr;
        };

        this.eval = function (obj) {
            this.error = false;
            try {
                return simplified.evaluate(obj);
            } catch (err) {
                this.errorMessage = err.message;
                this.error = true;
                return 0;
            }
        };
    }
}