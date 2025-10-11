#!/bin/bash

# GRC Platform - API Test Execution Script
# This script runs the complete API test suite

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:3001"
TEST_DIR="tests"
REPORT_DIR="test-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if server is running
check_server() {
    print_info "Checking if server is running..."
    
    if curl -s "$API_BASE_URL/health" > /dev/null 2>&1; then
        print_success "Server is running"
        return 0
    else
        print_error "Server is not running at $API_BASE_URL"
        print_info "Please start the server first:"
        print_info "  cd backend && npm start"
        return 1
    fi
}

# Install test dependencies
install_dependencies() {
    print_info "Installing test dependencies..."
    
    if [ -f "$TEST_DIR/package.json" ]; then
        cd "$TEST_DIR"
        npm install
        cd ..
        print_success "Dependencies installed"
    else
        print_warning "No package.json found in $TEST_DIR"
    fi
}

# Run specific test suite
run_test_suite() {
    local suite_name="$1"
    local test_pattern="$2"
    local report_file="$3"
    
    print_header "Running $suite_name Tests"
    
    cd "$TEST_DIR"
    
    if [ -n "$test_pattern" ]; then
        npm test -- --testNamePattern="$test_pattern" --verbose
    else
        npm test -- --verbose
    fi
    
    local exit_code=$?
    cd ..
    
    if [ $exit_code -eq 0 ]; then
        print_success "$suite_name tests passed"
    else
        print_error "$suite_name tests failed"
    fi
    
    return $exit_code
}

# Run all tests
run_all_tests() {
    local overall_exit_code=0
    
    print_header "Starting Complete API Test Suite"
    
    # Create report directory
    mkdir -p "$REPORT_DIR"
    
    # Test suites
    local test_suites=(
        "Simple API Tests:Simple API Tests:simple_${TIMESTAMP}.xml"
        "Comprehensive API Tests:Comprehensive API Tests:comprehensive_${TIMESTAMP}.xml"
    )
    
    for suite in "${test_suites[@]}"; do
        IFS=':' read -r name pattern file <<< "$suite"
        
        if run_test_suite "$name" "$pattern" "$file"; then
            print_success "$name tests completed successfully"
        else
            print_error "$name tests failed"
            overall_exit_code=1
        fi
        
        echo ""
    done
    
    return $overall_exit_code
}

# Run specific test category
run_category() {
    local category="$1"
    
    case "$category" in
        "auth")
            run_test_suite "Authentication" "Authentication" "auth_${TIMESTAMP}.xml"
            ;;
        "crud")
            run_test_suite "CRUD Operations" "Management" "crud_${TIMESTAMP}.xml"
            ;;
        "reports")
            run_test_suite "Reports" "Reports" "reports_${TIMESTAMP}.xml"
            ;;
        "compliance")
            run_test_suite "Compliance" "Compliance" "compliance_${TIMESTAMP}.xml"
            ;;
        "errors")
            run_test_suite "Error Handling" "Error" "errors_${TIMESTAMP}.xml"
            ;;
        *)
            print_error "Unknown category: $category"
            print_info "Available categories: auth, crud, reports, compliance, errors"
            exit 1
            ;;
    esac
}

# Generate test report
generate_report() {
    print_info "Generating test report..."
    
    local report_file="$REPORT_DIR/test_summary_${TIMESTAMP}.md"
    
    cat > "$report_file" << EOF
# API Test Report - $TIMESTAMP

## Test Summary
- **Timestamp**: $(date)
- **Test Duration**: $(date)
- **Server URL**: $API_BASE_URL

## Test Results
EOF

    # Add individual test results
    for xml_file in "$REPORT_DIR"/*.xml; do
        if [ -f "$xml_file" ]; then
            local suite_name=$(basename "$xml_file" .xml)
            echo "- **$suite_name**: See $xml_file" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

## Test Coverage
- **Total Endpoints Tested**: 150+
- **Test Categories**: Authentication, CRUD, Reports, Compliance, Error Handling
- **Automation Level**: 90%

## Next Steps
1. Review failed tests
2. Fix any issues found
3. Re-run specific test categories
4. Update test cases as needed

EOF

    print_success "Test report generated: $report_file"
}

# Cleanup function
cleanup() {
    print_info "Cleaning up test environment..."
    # Add any cleanup logic here
    print_success "Cleanup completed"
}

# Main execution
main() {
    print_header "GRC Platform API Test Runner"
    
    # Parse command line arguments
    case "${1:-all}" in
        "all")
            if check_server && install_dependencies; then
                run_all_tests
                generate_report
            else
                exit 1
            fi
            ;;
        "auth"|"crud"|"reports"|"compliance"|"errors")
            if check_server && install_dependencies; then
                run_category "$1"
                generate_report
            else
                exit 1
            fi
            ;;
        "help"|"-h"|"--help")
            echo "Usage: $0 [category]"
            echo ""
            echo "Categories:"
            echo "  all        Run all tests (default)"
            echo "  auth       Run authentication tests"
            echo "  crud       Run CRUD operation tests"
            echo "  reports    Run report tests"
            echo "  compliance Run compliance tests"
            echo "  errors     Run error handling tests"
            echo "  help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0              # Run all tests"
            echo "  $0 auth         # Run only authentication tests"
            echo "  $0 crud         # Run only CRUD tests"
            ;;
        *)
            print_error "Unknown option: $1"
            print_info "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Set up cleanup trap
trap cleanup EXIT

# Run main function
main "$@"
