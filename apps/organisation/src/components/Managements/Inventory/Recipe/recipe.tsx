import { useMutation, useQuery } from '@apollo/client';
import { ChangeEvent, useEffect, useState } from 'react';
import { GET_RECEIPE } from '@organisation/api/queries/Receipe';
import { DELETE_RECEIPE } from '@organisation/api/mutations/Receipe';
import { useNavigate } from 'react-router-dom';
import { Iconbutton, Paragraph } from '@ethos-frontend/ui';
import { Card, GridContainer } from '@ethos-frontend/components';
import { DeleteModal, Header } from '../../../Common';
import {
  Skeleton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { getNumberOfCols, useResponsive } from '@ethos-frontend/utils';
import { useTranslation } from 'react-i18next';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-root': {
    ...theme.typography.subtitle2,
    '&.MuiTableCell-head': {
      color: 'grey',
    },
  },
}));

export const RecipeCards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDesktop, isMobile } = useResponsive();
  const [searchKey, setSearchKey] = useState<string>('');
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [receipe, setReceipe] = useState([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReceipe, setSelectedReceipe] =
    useState<Record<string, unknown>>();

  const { loading, refetch, data } = useQuery(GET_RECEIPE, {
    variables: {
      params: {
        searchKey: searchKey,
        limit: page.limit,
        pageNo: page.pageNo,
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      setReceipe(data.recipies.data);
    }
  }, [data]);

  const [deleteReceipe] = useMutation(DELETE_RECEIPE, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      refetch();
    },
  });

  const handleActions = (receipe: Record<string, unknown>, key: string) => {
    if (key === 'edit') {
      navigate(`/editReceipe/${receipe._id}`);
    }
    if (key === 'delete') {
      setSelectedReceipe(receipe);
      setIsDeleteOpen(true);
    }
  };

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  return (
    <>
      <Header
        title={t('receipeCard.title')}
        onClick={() => {
          navigate('/add-recipe-card');
        }}
        handleChange={onSearchHandler}
        buttonText={t('receipeCard.add')}
      />
      {loading ? (
        <div className="flex gap-4">
          {[...Array(1)].map((_, index) => (
            <Card key={index} className="w-1/3">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="rectangular" height={100} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Card>
          ))}
        </div>
      ) : (
        <GridContainer
          columns={getNumberOfCols({
            isDesktop,
            isMobile,
            mobileCol: 1,
            desktopCol: 3,
          })}
        >
          {receipe.map((ele: any) => (
            <Card
              button={
                <div className="flex gap-1">
                  <Iconbutton
                    name="edit"
                    onClick={() => handleActions(ele, 'edit')}
                  />

                  <Iconbutton
                    name="delete"
                    iconColor="red"
                    onClick={() => handleActions(ele, 'delete')}
                  />
                </div>
              }
            >
              {ele.product.length ? (
                <div className="pb-4">
                  <Paragraph variant="h5" weight="medium">
                    {t('products')}:
                  </Paragraph>{' '}
                  <Paragraph variant="h5" color="primary">
                    {ele.product
                      .map((p: { name: string }) => p.name)
                      .join(', ')}
                  </Paragraph>
                </div>
              ) : null}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      {t('receipeCard.ingredients')}
                    </StyledTableCell>
                    <StyledTableCell>{t('tableData.quantity')}</StyledTableCell>
                    <StyledTableCell>{t('receipeCard.waste')}</StyledTableCell>
                    <StyledTableCell>{t('tableData.uom')}</StyledTableCell>
                  </TableRow>
                </TableHead>
                {ele.ingredients.map((ingredient: any) => {
                  const productName = ele.rawMaterial.filter((raw: any) => {
                    return raw._id === ingredient.rawMaterialId;
                  });
                  return (
                    <TableBody>
                      <TableRow>
                        <StyledTableCell>{productName[0].name}</StyledTableCell>
                        <StyledTableCell>{ingredient.qty}</StyledTableCell>
                        <StyledTableCell>
                          {ingredient.waste.valueType === 'Percentage'
                            ? `${ingredient.waste.value}%`
                            : ingredient.waste.value}
                        </StyledTableCell>
                        <StyledTableCell>
                          {ingredient.waste.uom}{' '}
                        </StyledTableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
              </Table>
            </Card>
          ))}
        </GridContainer>
      )}
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={() => {
          deleteReceipe({ variables: { data: selectedReceipe?._id } });
        }}
      />
    </>
  );
};
