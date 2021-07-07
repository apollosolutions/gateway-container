tests=$(find $(dirname $0) -name "*_test.sh")
failed_tests=()

for test in $tests
do
  echo "=== RUNNING $test ==="
  bash $test

  if [[ $? -ne  0 ]]; then
    failed_tests+=($test)
  fi
done

if [[ ${#failed_tests[*]} -ne 0 ]]; then
  echo "=== FAILED TESTS ==="
  echo $failed_tests
  exit 1
fi
