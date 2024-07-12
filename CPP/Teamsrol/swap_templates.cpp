#include <iostream>
#include <utility>

void swap(int &lhs, int &rhs, double) {
  int tmp = lhs;
  lhs = rhs;
  rhs = tmp;
  std::cout << "1";
}

void swap(double &lhs, double &rhs) {
  double tmp = lhs;
  lhs = rhs;
  rhs = tmp;
  std::cout << "2";
}

template <typename T> void swap(T &lhs, T &rhs, int) {
  T tmp = lhs;
  lhs = rhs;
  rhs = tmp;
  std::cout << "3";
}

template <typename T, int N> void swap_constexpr(T &lhs, T &rhs) {
  if constexpr (N % 2 == 1) {
    std::swap(lhs, rhs);
  } // else {} // nothing to do
}

int main() {
  int i{10}, j{20};
  double k{10.123}, l{20.848};

  swap(i, j, 12);
  swap(i, j, 12);
  swap(i, j, 12);
  // swap(k, l);
}
