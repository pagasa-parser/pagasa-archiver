# PAGASA Archiver
The PAGASA Archiver is a CLI tool and library for pulling bulletins and advisories from the DOST-PAGASA's
pubfiles website ([pubfiles.pagasa.dost.gov.ph](https://pubfiles.pagasa.dost.gov.ph)). You can use it as a
CLI tool or as a library to programatically list and download all available PAGASA Tropical Cyclone Bulletins
and Tropical Cyclone Advisories.

## Usage
```
Options:
      --help                        Show help                          [boolean]
      --version                     Show version number                [boolean]
  -v, --verbose                     Verbosity. Used to generate more detailed
                                    log output.                          [count]
  -q, --quiet                       Quiet mode. Overrides `v`, mutes all output
                                    (besides stdout, if using --json). [boolean]
  -f, --force                       Forcefully overwrite files if a conflicting
                                    filename exists.  [boolean] [default: false]
  -u, --include-unnamed, --unnamed  Include bulletins/advisories with no names.
                                    This is commonly more used with TCAs, where
                                    a storm may not be named yet before entry
                                    into the PAR. Storms with unknown names are
                                    marked "Unnamed". [boolean] [default: false]
  -d, --download                    Whether to download bulletins and advisories
                                    or not.            [boolean] [default: true]
      --tca, --tcas, --tcas-only    When enabled, only TCAs are processed,
                                    unless --tcb is also supplied.
                                                       [boolean] [default: null]
      --tcb, --tcbs, --tcbs-only    When enabled, only TCBs are processed,
                                    unless --tca is also supplied.
                                                       [boolean] [default: null]
      --index                       The index URL to use. Use this when
                                    downloading from websites other than the
                                    DOST-PAGASA pubfiles website, or in
                                    automated scripts as a backup if the
                                    DOST-PAGASA pubfiles website is
                                    inaccessible. This sets the index for both
                                    TCAs and TCBs, use --index-tca and
                                    --index-tcb for more fine tuning.   [string]
      --index-tca                   The index URL to use for tropical cyclone
                                    advisories. See --index for more details.
                                                                        [string]
      --index-tcb                   The index URL to use for tropical cyclone
                                    bulletins. See --index for more details.
                                                                        [string]
      --json                        Dump JSON of the available TCAs and/or TCBs
                                    (depending on --tca or --tcb) into stdout.
                                    Actual output is still logged through
                                    stderr.                            [boolean]
```