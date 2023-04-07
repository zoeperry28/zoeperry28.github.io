from order import *

def main():
    ol = OrderList("ST65TJ")
    ol.AddToList("123", "sofa", "012345678910", "ST65TJ")
    ol.AddToList("124", "sofa", "012345678910", "CW26HR")
    ol.AddToList("126", "sofa", "012345678910", "ST74HB")
    ol.AddToList("125", "sofa", "012345678910", "CW56PH")

    result = ol.OptimiseJourney()

if __name__ == "__main__":
    main()  