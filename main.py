from order import *

def main():
    dist = APICalls()
    out = dist.Get_DistanceAndDuration("ST74BT", "CW26HR")
    print(out)

if __name__ == "__main__":
    main()