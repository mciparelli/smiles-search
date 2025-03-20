let H = ["SCL", "LIM", "BOG", "BUE", "MVD", "ASU", "UIO"]
  , F = ["SCL", "MVD", "ASU", "SAO", "RIO"]
  , e = ["BUE", "COR", "ROS", "MDZ", "NQN", "BRC", "IGR"]
  , Y = ["RIO", "SAO", "FLN", "MCZ", "SSA", "REC", "NAT", "IGU"]
  , V = ["BOG", "ADZ", "CTG", "SMR"]
  , r = ["CUN", "PTY", "PUJ", "SJO", "AUA", "HAV", "CTG", "SJU"]
  , K = ["MEX", "CHI", "NYC", "LAX", "DFW", "SFO", "LAS"]
  , d = ["NYC", "WAS", "PHL", "BOS", "DTT", "CHI"]
  , f = ["LAX", "HNL", "SFO", "LAS", "SAN", "SMF"]
  , W = ["DFW", "PHX", "IAH", "SAT", "ATL"]
  , X = ["MIA", "FLL", "MCO", "TPA"]
  , Z = ["HNL", "LIH", "KOA", "OGG"]
  , _ = ["YTO", "YMQ", "YVR", "YOW", "YQB"]
  , p = ["LIS", "MAD", "BCN", "PAR", "AMS", "ROM", "LON", "FRA", "IST"]
  , u = ["BRU", "ATH", "BER", "ZRH", "VIE", "PRG"]
  , Q = ["MAD", "BCN", "VLC", "PMI", "AGP", "IBZ", "SVQ", "BIO"]
  , a = ["ROM", "MIL", "BLQ", "VCE", "NAP"]
  , l = ["PAR", "MRS", "NCE", "LYS", "NTE", "TLS"]
  , m = ["CPH", "HEL", "STO", "OSL", "BGO", "SVG", "GOT"]
  , x = ["DXB", "BKK", "TLV", "TYO", "SEL", "DPS"]
  , J = ["IST", "CAI", "DXB", "TLV", "DOH"]
  , i = ["BKK", "SIN", "MLE", "DPS", "SGN", "KUL"]
  , g = ["TYO", "SEL", "HKG"]
  , b = ["DEL", "BLR", "BOM", "CCU", "JAI"]
  , h = ["CAI", "SEZ", "CPT", "DAR", "ADD", "RBA"]
  , j = ["AKL", "SYD", "MEL"]
  , k = {
    SAMERICA: H,
    LIMITROFE: F,
    ARGENTINA: e,
    BRASIL: Y,
    COLOMBIA: V,
    CARIBE: r,
    NAMERICA: K,
    FLORIDA: X,
    HAWAII: Z,
    USAESTE: d,
    USAOESTE: f,
    USASUR: W,
    CANADA: _,
    EUROPA: p,
    CEUROPA: u,
    ESPANA: Q,
    ITALIA: a,
    FRANCIA: l,
    NORDICO: m,
    ASIA: x,
    MORIENTE: J,
    SASIA: i,
    NASIA: g,
    INDIA: b,
    AFRICA: h,
    OCEANIA: j
  }

export default k;
