# Neuroscout-cli

The Neuroscout Command Line Interface (_neuroscout-cli_) allows you to easily execute analyses created on [neuroscout.org](https://neuroscout.org).

_neuroscout-cli_ makes it easy to run your analysis with no configuration by fetching a self-contained analysis bundle, and downloading the required preprocessed fMRI data at run time using [DataLad](https://www.datalad.org/). _neuroscout-cli_ internally uses [FitLins](https://github.com/poldracklab/fitlins), a python pipeline for fMRI analysis in BIDS, to fits a statistical model to the fMRI data, and produce comprehensive reports. _neuroscout-cli_ automatically uploads the fitted images to [Neurovault](https://www.neurovault.org/), and links them to the analysis listing, making it easy to view and share your results.

## Installation & Usage

The recommended way to install and use _neuroscout-cli_ is using container technologies. Containers greatly facilitate the management of software dependencies, and increase reproducibility of results. 

You can also install _neuroscout-cli_ directly on your system using a manually prepared environment. Note that it may be more difficult to pin down dependencies using their approach. 

### Containerized Execution

#### Docker

For most systems, we recommend using [Docker](https://www.docker.com/resources/what-container) containers. First, follow the instructions for installing [Docker](https://docs.docker.com/engine/install/) on your system.

Next, follow our guide for running [Neuroscout on Docker](docker.md)

#### Singularity

[Singularity](https://sylabs.io/singularity/) containers are a great solution for High Performance Computing (HPC) environments, where _Docker_ cannot typically be used due to more tightly controlled [user privileges](https://researchcomputing.princeton.edu/support/knowledge-base/singularity).

First, check with your HPC administrator that _Singularity_ is available for use. If so, follow our guide for running [Neuroscout on Singularity](singulraity.md).


### Manually prepared environment

!!! Danger
    Manually installing _neuroscout-cli_ is not currently recommended. Proceed only if you really need to do this.

Use pip to install _neuroscout-cli_ directly from the GitHub repo:

    pip install -e git+https://www.github.com/neuroscout/neuroscout-cli#egg=neuroscout_cli

## Command line reference

Once you understand how to use Neuroscout on your environment of choice, take a look at our [command line reference documentation](cli_ref.md) for more details.
